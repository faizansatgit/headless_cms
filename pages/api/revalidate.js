import crypto from "crypto";
import { isSafeRevalidateSlug } from "../../lib/graphqlInputGuards";

function timingSafeSecretEqual(provided, expected) {
    if (typeof provided !== "string" || typeof expected !== "string") {
        return false;
    }
    const a = Buffer.from(provided, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) {
        return false;
    }
    return crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
    const secret = process.env.REVALIDATION_SECRET;
    if (
        !secret ||
        !timingSafeSecretEqual(String(req.query.secret ?? ""), secret)
    ) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const type = req.query.type;
    const slug = req.query.slug;

    let path = "";
    if (type === "post") {
        if (!isSafeRevalidateSlug(slug)) {
            return res.status(400).json({ message: "Invalid slug" });
        }
        path = "/blog/" + slug;
    } else if (type === "page") {
        if (!isSafeRevalidateSlug(slug)) {
            return res.status(400).json({ message: "Invalid slug" });
        }
        path = "/" + slug;
    } else if (type === "home") {
        path = "/blog";
    } else {
        return res.status(400).json({ message: "Invalid type" });
    }

    try {
        await res.revalidate(path);
        return res.json({ revalidated: true });
    } catch {
        return res.status(500).json({ message: "Revalidation failed" });
    }
}
