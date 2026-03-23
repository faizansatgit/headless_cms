/**
 * Decode common HTML entities for plain-text titles (WooCommerce returns &#8220; etc.).
 */
export function decodeHtmlEntities(str) {
    if (str == null || typeof str !== "string") return "";
    let s = str;
    s = s.replace(/&#x([0-9a-f]+);/gi, (_, h) =>
        String.fromCodePoint(parseInt(h, 16))
    );
    s = s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
    s = s
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    return s;
}
