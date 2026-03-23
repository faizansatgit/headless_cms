import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CheckoutCompleteRedirect() {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;
        const q = new URLSearchParams();
        const order = router.query.order;
        const key = router.query.key;
        const o = Array.isArray(order) ? order[0] : order;
        const k = Array.isArray(key) ? key[0] : key;
        if (o) q.set("order", o);
        if (k) q.set("key", k);
        const suffix = q.toString() ? `?${q.toString()}` : "";
        router.replace(`/order-received${suffix}`);
    }, [router, router.isReady, router.query.order, router.query.key]);

    return (
        <>
            <Head>
                <title>Order received</title>
            </Head>
            <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
                <p className="text-slate-400">Loading…</p>
            </div>
        </>
    );
}
