import Link from "next/link";
import { decodeHtmlEntities } from "../lib/decodeHtmlEntities";
import { formatMinorAmount } from "../lib/formatWcMoney";

function listPriceContent(product) {
    const p = product.prices;
    if (!p) return { html: null, text: "" };
    if (Number(p.price) > 0) {
        return { html: null, text: formatMinorAmount(p.price, p) };
    }
    if (Number(p.sale_price) > 0) {
        return { html: null, text: formatMinorAmount(p.sale_price, p) };
    }
    if (Number(p.regular_price) > 0) {
        return { html: null, text: formatMinorAmount(p.regular_price, p) };
    }
    if (product.price_html) {
        return { html: product.price_html, text: "" };
    }
    return { html: null, text: "" };
}

export default function ShopProductCard({ product }) {
    const img = product.images?.[0];
    const title = decodeHtmlEntities(product.name);
    const { html: priceHtml, text: priceText } = listPriceContent(product);

    return (
        <li className="rounded-xl overflow-hidden bg-slate-700/60 border border-slate-600/80 flex flex-col">
            <Link href={`/shop/${product.slug}`} className="block aspect-square relative bg-slate-900 overflow-hidden">
                {img?.src ? (
                    <img
                        src={img.src}
                        alt={img.alt || title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                        No image
                    </div>
                )}
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <Link href={`/shop/${product.slug}`}>
                    <h2 className="text-lg font-medium text-slate-100 hover:text-yellow-400 transition">
                        {title}
                    </h2>
                </Link>
                {priceHtml ? (
                    <div
                        className="mt-2 text-yellow-400 font-semibold [&_del]:text-slate-500 [&_ins]:no-underline"
                        dangerouslySetInnerHTML={{ __html: priceHtml }}
                    />
                ) : (
                    <p className="mt-2 text-yellow-400 font-semibold">
                        {priceText}
                    </p>
                )}
                <div
                    className="mt-2 text-slate-400 text-sm line-clamp-2"
                    dangerouslySetInnerHTML={{
                        __html: product.short_description || "",
                    }}
                />
                <div className="mt-auto pt-4">
                    <Link
                        href={`/shop/${product.slug}`}
                        className="inline-block text-slate-900 bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-md transition text-center w-full"
                    >
                        View product
                    </Link>
                </div>
            </div>
        </li>
    );
}
