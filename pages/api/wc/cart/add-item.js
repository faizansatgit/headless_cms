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
        const { id, quantity, variation } = req.body || {};
        if (id == null) {
            return res.status(400).json({ message: "id is required" });
        }
        const { res: wcRes, data, cartToken } = await wcStoreMutation(
            "/cart/add-item",
            {
                id: Number(id),
                quantity: quantity != null ? Number(quantity) : 1,
                ...(Array.isArray(variation) && variation.length
                    ? { variation }
                    : {}),
            },
            token
        );
        res.appendHeader("Set-Cookie", writeCartTokenCookieHeader(cartToken));
        return res.status(wcRes.status).json(data);
    } catch (e) {
        return res.status(502).json({ message: e.message || "Store API error" });
    }
}
