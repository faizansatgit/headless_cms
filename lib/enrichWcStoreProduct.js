import { getWordPressUrl } from "./wcStoreConstants";

/**
 * Variable products often have parent price "0" and is_purchasable false in the Store API.
 * Fetch each variation so we can show correct price/stock and allow add-to-cart.
 */
export async function enrichVariableProduct(product) {
    if (product.type !== "variable" || !product.variations?.length) {
        return product;
    }

    const base = getWordPressUrl();
    const variationDetails = {};

    await Promise.all(
        product.variations.map(async (v) => {
            try {
                const r = await fetch(
                    `${base}/wp-json/wc/store/v1/products/${v.id}`
                );
                if (!r.ok) return;
                const d = await r.json();
                variationDetails[v.id] = {
                    prices: d.prices,
                    is_purchasable: d.is_purchasable,
                    is_in_stock: d.is_in_stock,
                    is_on_backorder: d.is_on_backorder,
                    low_stock_remaining: d.low_stock_remaining,
                    sold_individually: d.sold_individually,
                    stock_availability: d.stock_availability,
                    add_to_cart: d.add_to_cart,
                };
            } catch {
                /* skip */
            }
        })
    );

    return { ...product, variationDetails };
}
