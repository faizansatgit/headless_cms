import {
    readCartTokenCookie,
    wcStoreMutation,
    writeCartTokenCookieHeader,
    clearCartTokenCookieHeader,
} from "../../../lib/wcStoreServer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const token = readCartTokenCookie(req.headers.cookie);
        const {
            payment_method,
            billing_address,
            shipping_address,
            customer_note,
        } = req.body || {};

        if (!payment_method || !billing_address || !shipping_address) {
            return res.status(400).json({
                message:
                    "payment_method, billing_address, and shipping_address are required",
            });
        }

        const payload = {
            payment_method,
            billing_address,
            shipping_address,
            ...(customer_note ? { customer_note } : {}),
        };

        const { res: wcRes, data, cartToken } = await wcStoreMutation(
            "/checkout",
            payload,
            token
        );

        const placed =
            wcRes.ok &&
            data &&
            !data.code &&
            (data.order_id || data.order_number);
        const redirectUrl = data?.payment_result?.redirect_url;

        if (placed && !redirectUrl) {
            res.appendHeader("Set-Cookie", clearCartTokenCookieHeader());
        } else {
            res.appendHeader("Set-Cookie", writeCartTokenCookieHeader(cartToken));
        }

        return res.status(wcRes.status).json(data);
    } catch (e) {
        return res.status(502).json({ message: e.message || "Store API error" });
    }
}
