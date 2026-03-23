import {
    readCartTokenCookie,
    wcStoreMutation,
    writeCartTokenCookieHeader,
} from "../../../../lib/wcStoreServer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const token = readCartTokenCookie(req.headers.cookie);
        const { key } = req.body || {};
        if (!key) {
            return res.status(400).json({ message: "key is required" });
        }
        const { res: wcRes, data, cartToken } = await wcStoreMutation(
            "/cart/remove-item",
            { key },
            token
        );
        res.appendHeader("Set-Cookie", writeCartTokenCookieHeader(cartToken));
        return res.status(wcRes.status).json(data);
    } catch (e) {
        return res.status(502).json({ message: e.message || "Store API error" });
    }
}
