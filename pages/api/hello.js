export default function handler(req, res) {
    if (process.env.NODE_ENV === "production") {
        return res.status(404).end();
    }
    res.status(200).json({ name: "John Doe" });
}
