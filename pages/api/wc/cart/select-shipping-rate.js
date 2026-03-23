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
        const { package_id, rate_id } = req.body || {};
        if (!rate_id) {
            return res.status(400).json({ message: "rate_id is required" });
        }
        const body =
            package_id !== undefined && package_id !== null
                ? { package_id, rate_id }
                : { rate_id };
        const { res: wcRes, data, cartToken } = await wcStoreMutation(
            "/cart/select-shipping-rate",
            body,
            token
        );
        res.appendHeader("Set-Cookie", writeCartTokenCookieHeader(cartToken));
        return res.status(wcRes.status).json(data);
    } catch (e) {
        return res.status(502).json({ message: e.message || "Store API error" });
    }
}
