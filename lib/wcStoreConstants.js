/**
 * WordPress site origin (WooCommerce Store API + media).
 * Set NEXT_PUBLIC_WORDPRESS_URL in .env.local for other environments.
 */
export function getWordPressUrl() {
    const raw = (
        process.env.NEXT_PUBLIC_WORDPRESS_URL ||
        "https://dev-headless-next.pantheonsite.io"
    ).replace(/\/$/, "");
    if (process.env.NODE_ENV === "production" && !raw.startsWith("https://")) {
        throw new Error(
            "NEXT_PUBLIC_WORDPRESS_URL must use https:// in production"
        );
    }
    return raw;
}

export function getWcStoreApiUrl() {
    return `${getWordPressUrl()}/wp-json/wc/store/v1`;
}

export const WC_CART_TOKEN_COOKIE = "wc_store_cart_token";
