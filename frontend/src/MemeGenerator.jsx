import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";

const MemeGenerator = () => {
    const [topText, setTopText] = useState("");
    const [bottomText, setBottomText] = useState("");
    const [templateId, setTemplateId] = useState("");
    const [memeImage, setMemeImage] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch meme templates
    useEffect(() => {
        axios.get("https://api.imgflip.com/get_memes")
            .then(res => setTemplates(res.data.data.memes))
            .catch(err => console.error("Error fetching memes:", err));
    }, []);

    // ✅ Generate Meme Function
    const generateMeme = async () => {
        if (!topText || !bottomText || !templateId) {
            alert("⚠️ Please enter text and select a template!");
            return;
        }
    
        setLoading(true);
        setMemeImage(null);
        setError("");
    
        try {
            console.log("📡 Sending request to backend...");
            const response = await axios.post("https://kumar-8a6m.onrender.com/generate-meme", 
                { topText, bottomText, templateId }, 
                { headers: { "Content-Type": "application/json" } }
            );
    
            console.log("✅ Response from backend:", response.data);
    
            if (response.data.memeUrl) {
                setMemeImage(response.data.memeUrl);
            } else {
                setError("⚠️ Failed to generate meme.");
                console.error("❌ Invalid response from server:", response.data);
            }
        } catch (error) {
            console.error("❌ Error generating meme:", error);
            setError("⚠️ Unable to generate meme. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-4 text-blue-600">🎭 Meme Generator</h1>
                <select 
                    onChange={(e) => setTemplateId(e.target.value)} 
                    className="w-full p-3 mb-4 border rounded-lg bg-gray-50 text-gray-700"
                >
                    <option value="">Select a Meme Template</option>
                    {templates.map((meme) => (
                        <option key={meme.id} value={meme.id}>{meme.name}</option>
                    ))}
                </select>
                <input 
                    type="text" 
                    placeholder="Top Text" 
                    value={topText} 
                    onChange={(e) => setTopText(e.target.value)} 
                    className="w-full p-3 mb-2 border rounded-lg"
                />
                <input 
                    type="text" 
                    placeholder="Bottom Text" 
                    value={bottomText} 
                    onChange={(e) => setBottomText(e.target.value)} 
                    className="w-full p-3 mb-4 border rounded-lg"
                />
                <button 
                    onClick={generateMeme} 
                    disabled={loading} 
                    className={`w-full text-white py-3 rounded-lg font-semibold ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    {loading ? "⏳ Generating..." : "🚀 Generate Meme"}
                </button>

                {memeImage && (
                    <div className="mt-6 p-4 bg-white rounded-xl shadow-md flex flex-col items-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Meme:</h2>
                        <img src={memeImage} alt="Generated Meme" className="rounded-lg border shadow-md"/>
                    </div>
                )}
                <p className="text-center mt-6 text-gray-600 font-semibold">Developed By Gopal Kumar</p>
            </div>
        </div>
    );
};

export default MemeGenerator;
