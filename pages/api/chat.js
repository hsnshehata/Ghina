import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!process.env.OPENAI_API_KEY || !process.env.YOUTUBE_API_KEY) {
    console.error("❌ خطأ: لم يتم ضبط `OPENAI_API_KEY` أو `YOUTUBE_API_KEY` في ملف البيئة.");
    return res.status(500).json({ error: "❌ API Keys are missing." });
  }

  try {
    const openAIRequestData = {
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `أنت مدرب ذكي متخصص في تدريب موظفي البيوتي سنتر.
          مهمتك تقديم توجيهات عملية في:
          - العناية بالبشرة: تنظيف عميق، ماسكات مناسبة، وأجهزة التجميل الحديثة مثل جهاز الهيدرافيشن و جهاز القناع الضوئي.
          - تصفيف الشعر
          - المساج: استخدام كرسي المساج الذكي iRest A309-STriple S، تقنيات الاسترخاء، والعلاج الطبيعي.
          - المكياج
          
          إذا كان السؤال يتعلق بمشاهدة فيديو تعليمي، أجب بإيجاز ثم أضف رابط لفيديو من يوتيوب.` 
        },
        { role: "user", content: message }
      ]
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(openAIRequestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🔴 OpenAI API Error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    let reply = data.choices[0]?.message?.content || "❌ لم يتم استلام رد من OpenAI.";

    if (message.includes("تنظيف البشرة") || message.includes("تصفيف الشعر") || message.includes("المساج") || message.includes("مكياج") || message.includes("فيديو") || message.includes("شرح")) {
      const youtubeQuery = encodeURIComponent(message);
      const youtubeURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${youtubeQuery}&key=${process.env.YOUTUBE_API_KEY}&maxResults=1&type=video`;

      try {
        const ytResponse = await axios.get(youtubeURL);
        const video = ytResponse.data.items[0];

        if (video) {
          const videoId = video.id.videoId;
          const videoTitle = video.snippet.title;
          const thumbnailUrl = video.snippet.thumbnails.high.url;
          const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

          // إصلاح طريقة تنسيق الفيديو
          reply += `
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 10px; background: #1e1e1e; padding: 10px; border-radius: 10px;">
            <a href="${videoLink}" target="_blank" style="text-decoration: none; color: white;">
              <img src="${thumbnailUrl}" alt="${videoTitle}" style="width: 100%; max-width: 400px; border-radius: 10px; margin-bottom: 5px; cursor: pointer; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);" />
              <p style="font-size: 16px; font-weight: bold; margin-top: 5px;">🎬 ${videoTitle}</p>
            </a>
          </div>`;
        }
      } catch (ytError) {
        console.error("❌ YouTube API Error:", ytError.response ? ytError.response.data : ytError.message);
      }
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Unhandled Error:", error);
    res.status(500).json({ error: "❌ حدث خطأ أثناء الاتصال بـ OpenAI API." });
  }
}
