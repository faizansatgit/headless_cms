import { getWcStoreApiUrl, WC_CART_TOKEN_COOKIE } from "./wcStoreConstants";

export function readCartTokenCookie(cookieHeader) {
    if (!cookieHeader) return "";
    const m = cookieHeader.match(
        new RegExp(`(?:^|;\\s*)${WC_CART_TOKEN_COOKIE}=([^;]+)`)
    );
    if (!m) return "";
    try {
        return decodeURIComponent(m[1].trim());
    } catch {
        return m[1].trim();
    }
}

export function writeCartTokenCookieHeader(token) {
    const maxAge = 60 * 60 * 24 * 30;
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const value = encodeURIComponent(token);
    return `${WC_CART_TOKEN_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

export function clearCartTokenCookieHeader() {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    return `${WC_CART_TOKEN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
}

async function readCartNonce(cartToken) {
    // Pantheon/Varnish may cache GET /cart as public without Vary: Cart-Token,
    // so identical URLs return a stale empty cart. Unique query avoids a shared cache key.
    const cb = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const res = await fetch(`${getWcStoreApiUrl()}/cart?cb=${encodeURIComponent(cb)}`, {
        headers: {
            Accept: "application/json",
            ...(cartToken ? { "Cart-Token": cartToken } : {}),
        },
    });
    const nonce = res.headers.get("nonce") || "";
    const newToken = res.headers.get("cart-token") || cartToken;
    const cart = await res.json();
    return { res, nonce, cartToken: newToken, cart };
}

/**
 * Runs a WooCommerce Store API mutation: refreshes nonce via GET /cart, then POSTs.
 */
export async function wcStoreMutation(path, body, cartToken) {
    const { nonce, cartToken: ct } = await readCartNonce(cartToken);
    const res = await fetch(`${getWcStoreApiUrl()}${path}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cart-Token": ct,
            Nonce: nonce,
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    const newCartToken = res.headers.get("cart-token") || ct;
    return { res, data, cartToken: newCartToken };
}

export async function wcStoreGetCart(cartToken) {
    return readCartNonce(cartToken);
}
