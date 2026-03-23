/** Block characters that break GraphQL string literals or enable injection. */
const UNSAFE_GRAPHQL_STRING = /["\\\n\r\u2028\u2029\x00-\x1f{}$]/;

const ALLOWED_POST_TAXONOMY_KEYS = new Set(["categoryName"]);

const CURSOR_RE = /^[A-Za-z0-9+/=_-]+$/;

/**
 * @param {string | null | undefined} cursor
 * @returns {string | null}
 */
export function assertSafeEndCursor(cursor) {
    if (cursor == null || cursor === "") return null;
    if (typeof cursor !== "string" || cursor.length > 512 || !CURSOR_RE.test(cursor)) {
        throw new Error("Invalid pagination cursor");
    }
    return cursor;
}

/**
 * @param {string} value
 * @param {number} maxLen
 */
export function assertSafeSlugForGraphql(value, maxLen = 200) {
    if (typeof value !== "string" || value.length === 0 || value.length > maxLen) {
        throw new Error("Invalid slug");
    }
    if (value.includes("/") || value.includes("..")) {
        throw new Error("Invalid slug");
    }
    if (UNSAFE_GRAPHQL_STRING.test(value)) {
        throw new Error("Invalid slug");
    }
    return value;
}

/**
 * Single URL path segment for on-demand revalidation (may include Unicode).
 * @param {unknown} slug
 * @returns {slug is string}
 */
export function isSafeRevalidateSlug(slug) {
    if (typeof slug !== "string" || slug.length === 0 || slug.length > 200) {
        return false;
    }
    if (slug.includes("/") || slug.includes("..")) {
        return false;
    }
    return !UNSAFE_GRAPHQL_STRING.test(slug);
}

/**
 * @param {{ key: string, value: string } | null | undefined} taxonomy
 * @returns {{ key: string, value: string } | null}
 */
export function normalizePostListTaxonomy(taxonomy) {
    if (taxonomy == null) return null;
    if (typeof taxonomy !== "object" || taxonomy === null) {
        throw new Error("Invalid taxonomy");
    }
    const key = taxonomy.key;
    const val = taxonomy.value;
    if (typeof key !== "string" || typeof val !== "string") {
        throw new Error("Invalid taxonomy");
    }
    if (!ALLOWED_POST_TAXONOMY_KEYS.has(key)) {
        throw new Error("Invalid taxonomy filter");
    }
    return { key, value: assertSafeSlugForGraphql(val) };
}
