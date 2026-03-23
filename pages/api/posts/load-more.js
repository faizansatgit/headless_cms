import { getPostList } from "../../../lib/posts";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: "Method not allowed" });
    }

    let body;
    try {
        body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch {
        return res.status(400).json({ message: "Invalid JSON" });
    }

    try {
        const posts = await getPostList(
            body?.endCursor ?? null,
            body?.taxonomy ?? null
        );
        res.setHeader(
            "Cache-Control",
            "private, no-store, max-age=0, must-revalidate"
        );
        return res.status(200).json(posts);
    } catch (e) {
        const message = e?.message || "Bad request";
        const status = /Invalid|required/i.test(message) ? 400 : 502;
        return res.status(status).json({ message });
    }
}
