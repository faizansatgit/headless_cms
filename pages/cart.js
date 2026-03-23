import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useCart } from "../components/CartContext";
import { formatMinorAmount } from "../lib/formatWcMoney";

export default function CartPage() {
    const { cart, loading, refreshCart } = useCart();
    const [busyKey, setBusyKey] = useState(null);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    async function updateLine(key, quantity) {
        setBusyKey(key);
        try {
            await fetch("/api/wc/cart/update-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ key, quantity }),
            });
            await refreshCart();
        } finally {
            setBusyKey(null);
        }
    }

    async function removeLine(key) {
        setBusyKey(key);
        try {
            await fetch("/api/wc/cart/remove-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ key }),
            });
            await refreshCart();
        } finally {
            setBusyKey(null);
        }
    }

    const items = cart?.items || [];
    const totals = cart?.totals;

    return (
        <>
            <Head>
                <title>Cart</title>
            </Head>
            <div className="min-h-screen bg-slate-900 text-slate-100">
                <section className="bg-slate-800 border-b border-slate-700">
                    <div className="container mx-auto lg:max-w-4xl px-4 py-4">
                        <SiteHeader />
                    </div>
                </section>

                <main className="container mx-auto lg:max-w-4xl px-4 py-10">
                    <h1 className="text-4xl font-medium mb-8">Your cart</h1>

                    {loading && !cart ? (
                        <p className="text-slate-400">Loading cart…</p>
                    ) : items.length === 0 ? (
                        <div className="space-y-4">
                            <p className="text-slate-300">Your cart is empty.</p>
                            <Link
                                href="/shop"
                                className="inline-block text-yellow-400 hover:underline"
                            >
                                Continue shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <ul className="space-y-6">
                                {items.map((item) => {
                                    const thumb =
                                        item.images?.[0]?.thumbnail ||
                                        item.images?.[0]?.src;
                                    const lineTotal = formatMinorAmount(
                                        item.totals?.line_total,
                                        totals
                                    );
                                    return (
                                        <li
                                            key={item.key}
                                            className="flex flex-col sm:flex-row gap-4 border border-slate-700 rounded-lg p-4 bg-slate-800/50"
                                        >
                                            <div className="relative w-full sm:w-28 h-28 shrink-0 bg-slate-900 rounded-md overflow-hidden">
                                                {thumb ? (
                                                    <Image
                                                        src={thumb}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="112px"
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="flex-grow">
                                                <h2 className="text-lg font-medium">
                                                    {item.name}
                                                </h2>
                                                <p className="text-yellow-400 mt-1">
                                                    {lineTotal}
                                                </p>
                                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                                    <label className="text-sm text-slate-400">
                                                        Qty{" "}
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="ml-2 w-16 border border-slate-600 bg-slate-900 text-slate-100 rounded px-2 py-1"
                                                            defaultValue={
                                                                item.quantity
                                                            }
                                                            key={item.key + item.quantity}
                                                            onBlur={(e) => {
                                                                const q =
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    ) || 1;
                                                                if (
                                                                    q !==
                                                                    item.quantity
                                                                ) {
                                                                    updateLine(
                                                                        item.key,
                                                                        q
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                    <button
                                                        type="button"
                                                        className="text-sm text-red-400 hover:underline disabled:opacity-50"
                                                        disabled={
                                                            busyKey === item.key
                                                        }
                                                        onClick={() =>
                                                            removeLine(item.key)
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-700 pt-8">
                                <p className="text-2xl text-slate-100">
                                    Total:{" "}
                                    <span className="text-yellow-400 font-semibold">
                                        {formatMinorAmount(
                                            totals?.total_price,
                                            totals
                                        )}
                                    </span>
                                </p>
                                <Link
                                    href="/checkout"
                                    className="inline-block text-center bg-yellow-400 text-slate-900 font-semibold px-8 py-3 rounded-md hover:bg-yellow-300 transition"
                                >
                                    Checkout
                                </Link>
                            </div>
                        </>
                    )}
                </main>
                <SiteFooter />
            </div>
        </>
    );
}
