import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useCart } from "../components/CartContext";
import { formatMinorAmount } from "../lib/formatWcMoney";

const emptyAddr = () => ({
    first_name: "",
    last_name: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "IN",
    email: "",
    phone: "",
});

const emptyShip = () => ({
    first_name: "",
    last_name: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "IN",
    phone: "",
});

export default function CheckoutPage() {
    const { cart, loading, refreshCart } = useCart();
    const [billing, setBilling] = useState(emptyAddr);
    const [shipping, setShipping] = useState(emptyShip);
    const [shipSame, setShipSame] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [customerNote, setCustomerNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const prefilledFromCart = useRef(false);

    const wpBase =
        process.env.NEXT_PUBLIC_WORDPRESS_URL ||
        "https://dev-headless-next.pantheonsite.io";

    useEffect(() => {
        if (!cart || prefilledFromCart.current) return;
        const b = cart.billing_address;
        const s = cart.shipping_address;
        const hasServer =
            (b && (b.email || b.first_name)) ||
            (s && (s.first_name || s.address_1));
        if (!hasServer) return;
        prefilledFromCart.current = true;
        if (b && (b.email || b.first_name)) {
            setBilling((prev) => ({
                ...prev,
                ...b,
                email: b.email || prev.email,
            }));
        }
        if (s && (s.first_name || s.address_1)) {
            setShipping((prev) => ({ ...prev, ...s }));
        }
    }, [cart]);

    useEffect(() => {
        const methods = cart?.payment_methods || [];
        if (!methods.length) return;
        const firstId =
            typeof methods[0] === "string" ? methods[0] : methods[0].id;
        if (!paymentMethod) {
            setPaymentMethod(firstId || "");
        }
    }, [cart?.payment_methods, paymentMethod]);

    async function ensureShippingSelected() {
        const r = await fetch("/api/wc/cart", { credentials: "include" });
        const c = await r.json();
        for (const pkg of c.shipping_rates || []) {
            const rates = pkg.shipping_rates || [];
            const hasSel = rates.some((x) => x.selected);
            if (!hasSel && rates[0]) {
                await fetch("/api/wc/cart/select-shipping-rate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        package_id: pkg.package_id,
                        rate_id: rates[0].rate_id,
                    }),
                });
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const shipPayload = shipSame ? billing : shipping;

            const ur = await fetch("/api/wc/cart/update-customer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    billing_address: billing,
                    shipping_address: shipPayload,
                }),
            });
            const udata = await ur.json();
            if (!ur.ok) {
                setError(
                    udata.message ||
                        udata.code ||
                        "Could not save addresses."
                );
                return;
            }

            await refreshCart();
            await ensureShippingSelected();
            await refreshCart();

            const cr = await fetch("/api/wc/cart", { credentials: "include" });
            const latest = await cr.json();
            const methods = latest.payment_methods || [];
            const methodIds = methods.map((m) =>
                typeof m === "string" ? m : m.id
            );

            if (!methodIds.length) {
                setError(
                    "No payment methods available for this cart. Enable gateways (e.g. Cash on delivery, Bank transfer, Stripe) in WooCommerce → Settings → Payments, or complete checkout on WordPress."
                );
                return;
            }

            const pm = methodIds.includes(paymentMethod)
                ? paymentMethod
                : methodIds[0];

            const chk = await fetch("/api/wc/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    payment_method: pm,
                    billing_address: billing,
                    shipping_address: shipPayload,
                    ...(customerNote.trim()
                        ? { customer_note: customerNote.trim() }
                        : {}),
                }),
            });
            const data = await chk.json();

            if (!chk.ok) {
                setError(
                    data.message ||
                        data.code ||
                        "Checkout failed. Check WooCommerce payment settings."
                );
                return;
            }

            const redirect = data.payment_result?.redirect_url;
            if (redirect) {
                window.location.href = redirect;
                return;
            }

            if (data.order_id || data.order_number) {
                await refreshCart();
                const q = new URLSearchParams({
                    order: String(data.order_id || data.order_number),
                    key: data.order_key || "",
                });
                window.location.href = `/order-received?${q.toString()}`;
                return;
            }

            setError("Unexpected checkout response.");
        } catch {
            setError("Network error. Try again.");
        } finally {
            setSubmitting(false);
        }
    }

    const totals = cart?.totals;
    const paymentMethods = cart?.payment_methods || [];

    return (
        <>
            <Head>
                <title>Checkout</title>
            </Head>
            <div className="min-h-screen bg-slate-900 text-slate-100">
                <section className="bg-slate-800 border-b border-slate-700">
                    <div className="container mx-auto lg:max-w-4xl px-4 py-4">
                        <SiteHeader />
                    </div>
                </section>

                <main className="container mx-auto lg:max-w-4xl px-4 py-10">
                    <h1 className="text-4xl font-medium mb-2">Checkout</h1>
                    <p className="text-slate-400 mb-8">
                        Billing and payment are processed by WooCommerce on your
                        WordPress site (Store API).
                    </p>

                    {loading && !cart ? (
                        <p className="text-slate-400">Loading…</p>
                    ) : !cart?.items?.length ? (
                        <div className="space-y-4">
                            <p>Your cart is empty.</p>
                            <Link
                                href="/shop"
                                className="text-yellow-400 hover:underline"
                            >
                                Go to shop
                            </Link>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="mb-8 p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                                <h2 className="text-xl text-slate-100 mb-2">
                                    Order total
                                </h2>
                                <p className="text-2xl text-yellow-400 font-semibold">
                                    {formatMinorAmount(
                                        totals?.total_price,
                                        totals
                                    )}
                                </p>
                                <Link
                                    href="/cart"
                                    className="text-sm text-yellow-400/80 hover:underline mt-2 inline-block"
                                >
                                    Edit cart
                                </Link>
                            </div>

                            <h2 className="text-2xl text-slate-100 mb-4">
                                Billing
                            </h2>
                            <label>
                                First name
                                <input
                                    className="text-black"
                                    required
                                    value={billing.first_name}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            first_name: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Last name
                                <input
                                    className="text-black"
                                    required
                                    value={billing.last_name}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            last_name: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Email
                                <input
                                    className="text-black"
                                    type="email"
                                    required
                                    value={billing.email}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Phone
                                <input
                                    className="text-black"
                                    required
                                    value={billing.phone}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            phone: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Address line 1
                                <input
                                    className="text-black"
                                    required
                                    value={billing.address_1}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            address_1: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Address line 2
                                <input
                                    className="text-black"
                                    value={billing.address_2}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            address_2: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                City
                                <input
                                    className="text-black"
                                    required
                                    value={billing.city}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            city: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                State / County
                                <input
                                    className="text-black"
                                    required
                                    value={billing.state}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            state: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Postcode
                                <input
                                    className="text-black"
                                    required
                                    value={billing.postcode}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            postcode: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Country (ISO code)
                                <input
                                    className="text-black"
                                    required
                                    value={billing.country}
                                    onChange={(e) =>
                                        setBilling((p) => ({
                                            ...p,
                                            country: e.target.value,
                                        }))
                                    }
                                />
                            </label>

                            <label className="flex items-center gap-2 !mb-6">
                                <input
                                    type="checkbox"
                                    checked={shipSame}
                                    onChange={(e) =>
                                        setShipSame(e.target.checked)
                                    }
                                />
                                <span>Ship to the same address</span>
                            </label>

                            {!shipSame && (
                                <>
                                    <h2 className="text-2xl text-slate-100 mb-4">
                                        Shipping
                                    </h2>
                                    <label>
                                        First name
                                        <input
                                            className="text-black"
                                            required
                                            value={shipping.first_name}
                                            onChange={(e) =>
                                                setShipping((p) => ({
                                                    ...p,
                                                    first_name: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label>
                                        Last name
                                        <input
                                            className="text-black"
                                            required
                                            value={shipping.last_name}
                                            onChange={(e) =>
                                                setShipping((p) => ({
                                                    ...p,
                                                    last_name: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label>
                                        Address line 1
                                        <input
                                            className="text-black"
                                            required
                                            value={shipping.address_1}
                                            onChange={(e) =>
                                                setShipping((p) => ({
                                                    ...p,
                                                    address_1: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label>
                                        Address line 2
                                        <input
                                            className="text-black"
                                            value={shipping.address_2}
                                            onChange={(e) =>
                                                setShipping((p) => ({
                                                    ...p,
                                                    address_2: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label>
                                        City
                                        <input
                                            className="text-black"
                                            required
                                            value={shipping.city}
                                            onChange={(e) =>
                                                setShipping((p) => ({
                                                    ...p,
                                                    city: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label>
                                        State
                                        <input
                                            className="text-black"
                                            required
                                            value={shipping.state}
                                            onChange={(e) =>
                                                setShipping((p) => ({
                                                    ...p,
                                                    state: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label>
                                        Postcode
                                        <input
                                            className="text-black"
                                            required
                                            value={shipping.postcode}
                                            onChange={(e) =>
                                                setShipping((p) => ({
                                                    ...p,
                                                    postcode: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label>
                                        Country
                                        <input
                                            className="text-black"
                                            required
                                            value={shipping.country}
                                            onChange={(e) =>
                                                setShipping((p) => ({
                                                    ...p,
                                                    country: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                    <label>
                                        Phone
                                        <input
                                            className="text-black"
                                            value={shipping.phone}
                                            onChange={(e) =>
                                                setShipping((p) => ({
                                                    ...p,
                                                    phone: e.target.value,
                                                }))
                                            }
                                        />
                                    </label>
                                </>
                            )}

                            <label>
                                Order notes (optional)
                                <textarea
                                    className="text-black"
                                    value={customerNote}
                                    onChange={(e) =>
                                        setCustomerNote(e.target.value)
                                    }
                                    rows={3}
                                />
                            </label>

                            <div className="mb-8 p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                                <h2 className="text-xl text-slate-100 mb-1">
                                    Payment
                                </h2>
                                <p className="text-slate-400 text-sm mb-4">
                                    Select how you would like to pay.
                                </p>
                            {paymentMethods.length ? (
                                <fieldset className="border-0 p-0 m-0 min-w-0">
                                    <legend className="sr-only">
                                        Payment method
                                    </legend>
                                    <div className="space-y-3">
                                        {paymentMethods.map((m, index) => {
                                            const id =
                                                typeof m === "string"
                                                    ? m
                                                    : m.id;
                                            const title =
                                                typeof m === "string"
                                                    ? m
                                                    : m.title || m.id;
                                            const selected =
                                                paymentMethod === id;
                                            return (
                                                <label
                                                    key={id}
                                                    className={`flex items-start gap-3 w-full cursor-pointer rounded-lg border px-4 py-3 transition ${
                                                        selected
                                                            ? "border-yellow-400 bg-slate-800/90 ring-1 ring-yellow-400/50"
                                                            : "border-slate-600 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-800/50"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        value={id}
                                                        checked={selected}
                                                        onChange={() =>
                                                            setPaymentMethod(id)
                                                        }
                                                        required={index === 0}
                                                        className="!w-4 !min-w-[1rem] !max-w-[1rem] !h-4 !mb-0 !p-0 !block shrink-0 mt-0.5 border-slate-500 accent-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                                                    />
                                                    <span className="text-left text-slate-100 font-medium leading-snug pt-0.5">
                                                        {title}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </fieldset>
                            ) : (
                                <p className="text-amber-400 text-sm mb-4">
                                    No methods listed yet. Save addresses above
                                    and ensure WooCommerce payments support the
                                    Store API. You can also{" "}
                                    <a
                                        href={`${wpBase.replace(/\/$/, "")}/checkout/`}
                                        className="underline hover:text-yellow-300"
                                    >
                                        pay on the WordPress checkout page
                                    </a>
                                    .
                                </p>
                            )}
                            </div>

                            {error ? (
                                <p className="text-red-400 mb-4">{error}</p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-4 bg-yellow-400 text-slate-900 font-semibold px-8 py-3 rounded-md hover:bg-yellow-300 disabled:opacity-50"
                            >
                                {submitting ? "Placing order…" : "Place order"}
                            </button>
                        </form>
                    )}
                </main>
                <SiteFooter />
            </div>
        </>
    );
}
