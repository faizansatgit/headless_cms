import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function OrderReceivedPage() {
    const router = useRouter();
    const order = router.query.order;
    const key = router.query.key;
    const orderLabel = Array.isArray(order) ? order[0] : order;
    const keyLabel = Array.isArray(key) ? key[0] : key;

    return (
        <>
            <Head>
                <title>Order received</title>
            </Head>
            <div className="min-h-screen bg-slate-900 text-slate-100">
                <section className="bg-slate-800 border-b border-slate-700">
                    <div className="container mx-auto lg:max-w-4xl px-4 py-4">
                        <SiteHeader />
                    </div>
                </section>
                <main className="container mx-auto lg:max-w-4xl px-4 py-16 text-center">
                    <h1 className="text-4xl font-medium text-green-400 mb-4">
                        Order received
                    </h1>
                    <p className="text-slate-300 text-lg mb-2">
                        Thank you. Your order has been received.
                    </p>
                    {orderLabel ? (
                        <p className="text-slate-200 text-xl mb-8">
                            Order number: <strong>#{orderLabel}</strong>
                        </p>
                    ) : (
                        <p className="text-slate-400 mb-8">
                            You can review order details in your WordPress admin
                            or confirmation email.
                        </p>
                    )}
                    {keyLabel ? (
                        <p className="text-slate-500 text-sm mb-8 break-all">
                            Order key: {keyLabel}
                        </p>
                    ) : null}
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/shop"
                            className="inline-block bg-yellow-400 text-slate-900 font-semibold px-6 py-3 rounded-md hover:bg-yellow-300"
                        >
                            Continue shopping
                        </Link>
                        <Link
                            href="/"
                            className="inline-block border border-slate-500 text-slate-200 px-6 py-3 rounded-md hover:border-yellow-400 hover:text-yellow-400"
                        >
                            Home
                        </Link>
                    </div>
                </main>
                <SiteFooter />
            </div>
        </>
    );
}
