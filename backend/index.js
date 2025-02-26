import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();

// app.use(cors({ origin: "*" }));
app.use(cors({
    origin: ["http://localhost:5174", "https://kumar-8a6m.onrender.com"],
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Running Check Route
app.get("/", (req, res) => {
    res.send("🎭 Meme Generator API is running! Use POST /generate-meme");
});

// ✅ Imgflip Credentials
const IMGFLIP_USERNAME = process.env.IMGFLIP_USERNAME;
const IMGFLIP_PASSWORD = process.env.IMGFLIP_PASSWORD;

// ✅ Proper POST Route for Meme Generation
app.post("/generate-meme", async (req, res) => {
    console.log("⚡ Received Request Body:", req.body);  

    const { topText, bottomText, templateId } = req.body;

    if (!topText || !bottomText || !templateId) {
        return res.status(400).json({ error: "⚠️ Missing required fields (topText, bottomText, templateId)" });
    }

    try {
        const response = await fetch("https://api.imgflip.com/caption_image", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                template_id: templateId,
                username: IMGFLIP_USERNAME,
                password: IMGFLIP_PASSWORD,
                text0: topText,
                text1: bottomText,
            }),
        });

        const data = await response.json();

        if (!data.success) {
            console.error("❌ Meme Generation Error:", data);
            return res.status(500).json({ error: "⚠️ Failed to generate meme" });
        }

        res.json({ memeUrl: data.data.url }); // ✅ Send Meme URL
    } catch (error) {
        console.error("❌ Backend Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
