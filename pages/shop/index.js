import Head from "next/head";
import { useEffect, useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ShopProductCard from "../../components/ShopProductCard";
import { getWordPressUrl } from "../../lib/wcStoreConstants";

export async function getStaticProps() {
    const base = getWordPressUrl();
    let products = [];
    try {
        const res = await fetch(
            `${base}/wp-json/wc/store/v1/products?per_page=100`,
            { headers: { Accept: "application/json" } }
        );
        if (res.ok) {
            const data = await res.json();
            products = Array.isArray(data) ? data : [];
        }
    } catch {
        products = [];
    }

    return {
        props: { products },
        revalidate: 60,
    };
}

export default function ShopIndex({ products: initialProducts }) {
    const [products, setProducts] = useState(() =>
        Array.isArray(initialProducts) ? initialProducts : []
    );
    const [clientError, setClientError] = useState(null);
    const [clientLoading, setClientLoading] = useState(false);

    useEffect(() => {
        if (products.length > 0) return;
        let cancelled = false;
        setClientLoading(true);
        setClientError(null);
        fetch("/api/wc/products")
            .then(async (r) => {
                const data = await r.json();
                if (!r.ok) {
                    throw new Error(data.message || "Could not load products");
                }
                if (!Array.isArray(data)) {
                    throw new Error("Invalid product data");
                }
                if (!cancelled) setProducts(data);
            })
            .catch((e) => {
                if (!cancelled) {
                    setClientError(e.message || "Could not load products");
                }
            })
            .finally(() => {
                if (!cancelled) setClientLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [products.length]);

    const list = Array.isArray(products) ? products : [];

    return (
        <>
            <Head>
                <title>Shop</title>
                <meta
                    name="description"
                    content="Browse products from our store"
                />
            </Head>
            <div className="min-h-screen bg-slate-900">
                <div className="h-[40vh] min-h-[12rem] bg-slate-800 relative border-b border-slate-700">
                    <div className="container lg:max-w-6xl mx-auto relative z-10">
                        <SiteHeader className="pt-4" />
                    </div>
                    <h1 className="relative z-10 text-center text-5xl md:text-6xl text-slate-100 pt-8 pb-4">
                        Shop
                    </h1>
                    <p className="relative z-10 text-center text-slate-200 text-lg pb-8">
                        WooCommerce products from WordPress
                    </p>
                </div>

                <main className="container mx-auto lg:max-w-6xl px-4 py-10">
                    {clientLoading && !list.length ? (
                        <p className="text-slate-300 text-center text-lg">
                            Loading products…
                        </p>
                    ) : null}
                    {clientError && !list.length ? (
                        <div className="text-center space-y-3">
                            <p className="text-red-400 text-lg">{clientError}</p>
                            <p className="text-slate-400 text-sm">
                                Set{" "}
                                <code className="text-slate-300">
                                    NEXT_PUBLIC_WORDPRESS_URL
                                </code>{" "}
                                to your WooCommerce site URL and ensure the Store
                                API is reachable from this machine.
                            </p>
                        </div>
                    ) : null}
                    {!clientLoading && !clientError && !list.length ? (
                        <p className="text-slate-300 text-center text-lg">
                            No products found. Check that WooCommerce is active and
                            the Store API is available on your WordPress site.
                        </p>
                    ) : null}
                    {list.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {list.map((p) =>
                                p && p.id != null && p.slug ? (
                                    <ShopProductCard key={p.id} product={p} />
                                ) : null
                            )}
                        </ul>
                    ) : null}
                </main>
                <div className="pb-8">
                    <SiteFooter />
                </div>
            </div>
        </>
    );
}
