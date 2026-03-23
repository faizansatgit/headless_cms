import { getWordPressUrl } from "./wcStoreConstants";

const GRAPHQL_TIMEOUT_MS = 15_000;

export default async function graphqlRequest(query) {
    const url = `${getWordPressUrl()}/graphql`;
    const headers = { "Content-Type": "application/json" };

    if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
        headers.Authorization = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GRAPHQL_TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            headers,
            method: "POST",
            body: JSON.stringify(query),
            signal: controller.signal,
        });
        const text = await res.text();
        let resJson;
        try {
            resJson = JSON.parse(text);
        } catch {
            throw new Error("WordPress GraphQL returned invalid JSON");
        }
        if (!res.ok) {
            throw new Error(`WordPress GraphQL HTTP ${res.status}`);
        }
        return resJson;
    } finally {
        clearTimeout(timeout);
    }
}