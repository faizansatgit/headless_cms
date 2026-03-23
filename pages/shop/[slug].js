import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { useCart } from "../../components/CartContext";
import { decodeHtmlEntities } from "../../lib/decodeHtmlEntities";
import { enrichVariableProduct } from "../../lib/enrichWcStoreProduct";
import { formatMinorAmount } from "../../lib/formatWcMoney";
import { getWordPressUrl } from "../../lib/wcStoreConstants";

export async function getStaticPaths() {
    const base = getWordPressUrl();
    let products = [];
    try {
        const res = await fetch(
            `${base}/wp-json/wc/store/v1/products?per_page=100`
        );
        if (res.ok) products = await res.json();
    } catch {
        products = [];
    }

    return {
        paths: products.map((p) => ({ params: { slug: p.slug } })),
        fallback: "blocking",
    };
}

export async function getStaticProps({ params }) {
    const base = getWordPressUrl();
    const { slug } = params;

    const res = await fetch(
        `${base}/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}`
    );
    if (!res.ok) return { notFound: true };

    const list = await res.json();
    const summary = list[0];
    if (!summary) return { notFound: true };

    const fullRes = await fetch(
        `${base}/wp-json/wc/store/v1/products/${summary.id}`
    );
    if (!fullRes.ok) return { notFound: true };

    const product = await fullRes.json();
    const enriched = await enrichVariableProduct(product);

    return {
        props: { product: enriched },
        revalidate: 60,
    };
}

function findVariationId(product, selection) {
    if (!product.variations?.length) return null;
    const expected =
        product.attributes?.filter((a) => a.has_variations).length || 0;
    for (const v of product.variations) {
        if (v.attributes.length !== expected) continue;
        const match = v.attributes.every((a) => {
            const sel = selection[a.name];
            if (!sel) return false;
            return (
                String(sel).toLowerCase() === String(a.value).toLowerCase()
            );
        });
        if (match) return v.id;
    }
    return null;
}

function buildVariationArray(product, selection) {
    const attrs = product.attributes?.filter((a) => a.has_variations) || [];
    const variation = [];
    for (const a of attrs) {
        const val = selection[a.name];
        if (!val) return null;
        variation.push({ attribute: a.name, value: val });
    }
    return variation;
}

const WC_QTY_DEFAULT_MAX = 9999;

function clampQuantityToLimits(raw, limits) {
    if (!limits || typeof limits !== "object") {
        const n = Number(raw);
        return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
    }
    const min = Number(limits.minimum) > 0 ? Number(limits.minimum) : 1;
    const max =
        Number(limits.maximum) > 0 ? Number(limits.maximum) : WC_QTY_DEFAULT_MAX;
    const step =
        Number(limits.multiple_of) > 0 ? Number(limits.multiple_of) : 1;
    let n = Number(raw);
    if (!Number.isFinite(n)) n = min;
    n = Math.min(max, Math.max(min, n));
    const steps = Math.round((n - min) / step);
    let aligned = min + steps * step;
    aligned = Math.min(max, Math.max(min, aligned));
    return aligned;
}

/** Human-readable stock for PDP; uses Store API limits + availability text */
function stockLabelForMeta(meta) {
    if (!meta) return "";
    if (meta.sold_individually) return "Limit 1 per order.";
    const low = meta.low_stock_remaining;
    if (low != null && Number(low) >= 0) {
        return `${low} in stock`;
    }
    const max = meta.add_to_cart?.maximum;
    if (
        typeof max === "number" &&
        max > 0 &&
        max < WC_QTY_DEFAULT_MAX
    ) {
        return `${max} in stock`;
    }
    const raw = meta.stock_availability?.text;
    const text = raw ? decodeHtmlEntities(raw).replace(/\s+/g, " ").trim() : "";
    if (text) return text;
    if (meta.is_in_stock) return "In stock";
    return "";
}

function variablePriceLabel(product, selection, variationDetails) {
    const details = variationDetails || {};
    const vid = findVariationId(product, selection);
    if (vid && details[vid]?.prices) {
        const pr = details[vid].prices;
        return formatMinorAmount(pr.price, pr);
    }
    const priceList = Object.values(details)
        .map((x) => x.prices)
        .filter((pr) => pr && Number(pr.price) > 0);
    if (!priceList.length) {
        const p = product.prices;
        if (p && Number(p.price) > 0) return formatMinorAmount(p.price, p);
        if (p && Number(p.sale_price) > 0)
            return formatMinorAmount(p.sale_price, p);
        if (p && Number(p.regular_price) > 0)
            return formatMinorAmount(p.regular_price, p);
        return "";
    }
    const nums = priceList.map((pr) => Number(pr.price));
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const meta = priceList[0];
    if (min === max) return formatMinorAmount(String(min), meta);
    return `${formatMinorAmount(String(min), meta)} – ${formatMinorAmount(String(max), meta)}`;
}

export default function ProductPage({ product }) {
    const { refreshCart, applyCartSnapshot } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [adding, setAdding] = useState(false);

    const variableAttrs = useMemo(
        () => product.attributes?.filter((a) => a.has_variations) || [],
        [product.attributes]
    );

    const initialSelection = useMemo(() => {
        const s = {};
        for (const a of variableAttrs) {
            const def = a.terms?.find((t) => t.default) || a.terms?.[0];
            if (def) s[a.name] = def.slug;
        }
        return s;
    }, [variableAttrs]);

    const [selection, setSelection] = useState(initialSelection);

    useEffect(() => {
        const attrs =
            product.attributes?.filter((a) => a.has_variations) || [];
        const s = {};
        for (const a of attrs) {
            const def = a.terms?.find((t) => t.default) || a.terms?.[0];
            if (def) s[a.name] = def.slug;
        }
        setSelection(s);
        setQuantity(1);
        setMessage("");
        // Only reset when navigating to another product — not when `attributes`
        // reference changes (e.g. hydration) which would wipe dropdown changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: [product.id] only
    }, [product.id]);

    const variationDetails = product.variationDetails || {};
    const variationId =
        product.type === "variable"
            ? findVariationId(product, selection)
            : null;
    const variationPayload =
        product.type === "variable"
            ? buildVariationArray(product, selection)
            : null;

    const selectedVarMeta =
        product.type === "variable" && variationId != null
            ? variationDetails[variationId]
            : null;

    const qtyLimits =
        product.type === "variable"
            ? selectedVarMeta?.add_to_cart
            : product.add_to_cart;

    const stockLine =
        product.type === "variable"
            ? selectedVarMeta
                ? stockLabelForMeta(selectedVarMeta)
                : ""
            : stockLabelForMeta(product);

    useEffect(() => {
        if (!qtyLimits) return;
        setQuantity((q) => {
            const next = clampQuantityToLimits(q, qtyLimits);
            return next === q ? q : next;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- primitives mirror qtyLimits without unstable object ref
    }, [
        product.id,
        variationId,
        qtyLimits?.minimum,
        qtyLimits?.maximum,
        qtyLimits?.multiple_of,
    ]);

    const priceLabel =
        product.type === "variable"
            ? variablePriceLabel(product, selection, variationDetails)
            : (() => {
                  const p = product.prices;
                  if (!p) return "";
                  if (Number(p.price) > 0)
                      return formatMinorAmount(p.price, p);
                  if (Number(p.sale_price) > 0)
                      return formatMinorAmount(p.sale_price, p);
                  if (Number(p.regular_price) > 0)
                      return formatMinorAmount(p.regular_price, p);
                  return "";
              })();

    const purchasable =
        product.type === "variable"
            ? variationId != null &&
              (selectedVarMeta == null ||
                  selectedVarMeta.is_in_stock !== false)
            : Boolean(product.is_purchasable);

    const stockNotice =
        product.type === "variable" && selectedVarMeta
            ? selectedVarMeta.stock_availability
            : product.stock_availability;

    const canAdd =
        purchasable &&
        (product.type !== "variable" ||
            (variationId != null && variationPayload));

    const addToCartId =
        product.type === "variable" ? variationId : product.id;

    const quantityForCart = clampQuantityToLimits(quantity, qtyLimits);

    const displayName = decodeHtmlEntities(product.name);

    async function handleAddToCart(e) {
        e.preventDefault();
        setMessage("");
        if (!canAdd || addToCartId == null) {
            setMessage("Choose all options before adding to cart.");
            return;
        }
        setAdding(true);
        try {
            // Store API accepts variation database id alone; sending a `variation`
            // array with slug values can 400 if it does not match the id exactly.
            const body = {
                id: Number(addToCartId),
                quantity: quantityForCart,
            };
            const r = await fetch("/api/wc/cart/add-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });
            const text = await r.text();
            let data = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = { message: text || "Invalid response." };
            }
            if (!r.ok) {
                setMessage(
                    data.message ||
                        data.data?.message ||
                        data.code ||
                        "Could not add to cart. Try again."
                );
                return;
            }
            /* Store API body is the full cart; use it immediately because
               refreshCart() right away can run before Set-Cookie is stored. */
            applyCartSnapshot(data);
            setMessage("Added to cart.");
            setTimeout(() => {
                refreshCart();
            }, 200);
        } catch {
            setMessage("Network error. Try again.");
        } finally {
            setAdding(false);
        }
    }

    const img = product.images?.[0];

    return (
        <>
            <Head>
                <title>{displayName} | Shop</title>
            </Head>
            <div className="min-h-screen bg-slate-900">
                <section className="bg-slate-800 border-b border-slate-700">
                    <div className="container mx-auto lg:max-w-6xl px-4 py-4">
                        <SiteHeader />
                        <Link
                            href="/shop"
                            className="text-yellow-400 hover:text-yellow-300 text-sm mt-2 inline-block"
                        >
                            ← Back to shop
                        </Link>
                    </div>
                </section>

                <main className="container mx-auto lg:max-w-6xl px-4 py-10 grid lg:grid-cols-2 gap-10">
                    <div className="relative aspect-square bg-slate-800 rounded-xl overflow-hidden">
                        {img?.src ? (
                            <Image
                                src={img.src}
                                alt={img.alt || displayName}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                No image
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-4xl text-slate-100 font-medium">
                            {displayName}
                        </h1>
                        <p className="mt-4 text-2xl text-yellow-400 font-semibold">
                            {priceLabel}
                        </p>
                        <div
                            className="mt-4 text-slate-300 prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{
                                __html:
                                    product.short_description ||
                                    product.description ||
                                    "",
                            }}
                        />

                        {variableAttrs.length === 0 && stockLine ? (
                            <p className="mt-4 text-slate-400 text-sm">
                                {stockLine}
                            </p>
                        ) : null}

                        {!purchasable && (
                            <p className="mt-4 text-red-400">
                                {stockNotice?.text ||
                                    "Currently unavailable."}
                            </p>
                        )}

                        {variableAttrs.length > 0 && (
                            <div className="mt-6 space-y-4">
                                {variableAttrs.map((attr) => (
                                    <label
                                        key={attr.id}
                                        className="block text-slate-200"
                                    >
                                        <span className="block text-sm mb-1">
                                            {attr.name}
                                        </span>
                                        <select
                                            className="w-full max-w-xs border border-slate-600 bg-slate-800 text-slate-100 rounded-md p-2"
                                            value={selection[attr.name] || ""}
                                            onChange={(e) =>
                                                setSelection((prev) => ({
                                                    ...prev,
                                                    [attr.name]: e.target.value,
                                                }))
                                            }
                                        >
                                            {(attr.terms || []).map((t) => (
                                                <option key={t.id} value={t.slug}>
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                ))}
                            </div>
                        )}

                        {variableAttrs.length > 0 && stockLine ? (
                            <p className="mt-4 text-slate-400 text-sm">
                                {stockLine}
                            </p>
                        ) : null}

                        <form onSubmit={handleAddToCart} className="mt-8 space-y-4">
                            <label className="block text-slate-200 text-sm">
                                Quantity
                                <input
                                    type="number"
                                    min={
                                        qtyLimits?.minimum != null
                                            ? qtyLimits.minimum
                                            : 1
                                    }
                                    max={
                                        qtyLimits?.maximum != null
                                            ? qtyLimits.maximum
                                            : WC_QTY_DEFAULT_MAX
                                    }
                                    step={
                                        qtyLimits?.multiple_of != null
                                            ? qtyLimits.multiple_of
                                            : 1
                                    }
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            clampQuantityToLimits(
                                                e.target.value,
                                                qtyLimits
                                            )
                                        )
                                    }
                                    className="block mt-1 w-24 border border-slate-600 bg-slate-800 text-slate-100 rounded-md p-2"
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={!canAdd || adding}
                                className="bg-yellow-400 text-slate-900 font-semibold px-6 py-3 rounded-md hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {adding ? "Adding…" : "Add to cart"}
                            </button>
                        </form>

                        {message ? (
                            <p
                                className={`mt-4 ${message.includes("Added") ? "text-green-400" : "text-red-400"}`}
                            >
                                {message}
                            </p>
                        ) : null}

                        <p className="mt-8 text-slate-500 text-sm">
                            <Link
                                href="/cart"
                                className="text-yellow-400 hover:underline"
                            >
                                View cart
                            </Link>
                        </p>
                    </div>
                </main>
                <SiteFooter />
            </div>
        </>
    );
}
