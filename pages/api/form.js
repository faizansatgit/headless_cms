const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ data: "Method not allowed" });
    }

    const body = req.body;
    const firstName = String(body?.firstName ?? "")
        .trim()
        .slice(0, 100);
    const email = String(body?.email ?? "").trim().slice(0, 254);
    const message = String(body?.message ?? "").trim().slice(0, 10000);

    if (!firstName || !email || !message) {
        return res.status(400).json({
            data: "First name, email, and message are required.",
        });
    }

    if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ data: "Invalid email address." });
    }

    return res.status(200).json({ data: "Form submitted successfully." });
}
