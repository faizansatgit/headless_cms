import {
    readCartTokenCookie,
    wcStoreGetCart,
    writeCartTokenCookieHeader,
} from "../../../lib/wcStoreServer";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const token = readCartTokenCookie(req.headers.cookie);
        const { cart, cartToken } = await wcStoreGetCart(token);
        res.appendHeader("Set-Cookie", writeCartTokenCookieHeader(cartToken));
        return res.status(200).json(cart);
    } catch (e) {
        return res.status(502).json({ message: e.message || "Store API error" });
    }
}
