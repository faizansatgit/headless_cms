import { createComment } from "../../lib/comments";

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
        const resJson = await createComment(body);

        if (resJson.errors?.length) {
            return res.status(400).json({
                message: resJson.errors[0].message || "Comment could not be saved",
            });
        }

        if (
            resJson.data?.createComment != null &&
            resJson.data.createComment.success === true
        ) {
            return res
                .status(200)
                .json({ message: "Your comment is awaiting approval" });
        }

        return res.status(500).json({ message: "Some error occurred" });
    } catch (e) {
        const message = e?.message || "Comment request failed";
        const status = /Invalid|required/i.test(message) ? 400 : 502;
        return res.status(status).json({ message });
    }
}
