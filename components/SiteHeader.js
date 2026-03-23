import Link from "next/link";
import { useCart } from "./CartContext";

export default function SiteHeader({ className }) {
    const { itemCount } = useCart();

    return (
        <header className={`${className} container mx-auto lg:max-w-4xl flex flex-wrap items-center justify-between gap-y-3`}>
            <div className="logo-area">
                <Link href="/" className="text-slate-100 text-2xl font-semibold tracking-tight hover:text-yellow-400 transition">
                    Store Transform
                </Link>
            </div>
            <nav className="text-slate-100">
                <ul className="flex flex-wrap justify-center items-center [&>li>a]:px-3 [&>li>a]:py-2 [&>li>a:hover]:text-yellow-400 [&>li>a]:transition text-lg md:text-xl">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/shop">Shop</Link>
                    </li>
                    <li>
                        <Link href="/blog">Blog</Link>
                    </li>
                    <li>
                        <Link href="/about">About</Link>
                    </li>
                    <li>
                        <Link href="/contact">Contact</Link>
                    </li>
                    <li>
                        <Link href="/cart" className="inline-flex items-center gap-2">
                            Cart
                            {itemCount > 0 ? (
                                <span className="bg-yellow-400 text-slate-900 text-sm font-bold min-w-[1.5rem] h-6 px-1.5 rounded-full flex items-center justify-center">
                                    {itemCount > 99 ? "99+" : itemCount}
                                </span>
                            ) : null}
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}