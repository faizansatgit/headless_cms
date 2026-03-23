import { getWordPressUrl } from "../../../lib/wcStoreConstants";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const base = getWordPressUrl();
        const url = `${base}/wp-json/wc/store/v1/products?per_page=100`;
        const wcRes = await fetch(url, {
            headers: { Accept: "application/json" },
        });

        if (!wcRes.ok) {
            return res.status(wcRes.status).json({
                message: `WordPress Store API returned ${wcRes.status}`,
            });
        }

        const data = await wcRes.json();
        if (!Array.isArray(data)) {
            return res.status(502).json({
                message: "Store API did not return a product list",
            });
        }

        res.setHeader(
            "Cache-Control",
            "public, s-maxage=30, stale-while-revalidate=60"
        );
        return res.status(200).json(data);
    } catch (e) {
        return res.status(502).json({
            message: e.message || "Failed to load products",
        });
    }
}
