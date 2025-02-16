import { useState, useEffect, useRef } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import axios from "axios";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef(null);

  // التحقق من تسجيل المستخدم
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        fetchMessages(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  // تحميل المحادثات من Firestore
  const fetchMessages = (email) => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    onSnapshot(q, (snapshot) => {
      const filteredMessages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((msg) => msg.userEmail === email);
      setMessages(filteredMessages);
    });
  };

  // إرسال الرسائل وحفظها
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { userEmail: user.email, sender: "user", text: input, timestamp: new Date() };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", { message: input });
      const botMessage = { userEmail: user.email, sender: "bot", text: response.data.reply, timestamp: new Date() };

      await addDoc(collection(db, "messages"), userMessage);
      await addDoc(collection(db, "messages"), botMessage);

      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  // التمرير التلقائي إلى آخر رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* شريط العنوان مع زر الرجوع */}
      <div className="flex justify-between items-center p-4 bg-gray-800 shadow-lg">
        <a className="text-gray-300 hover:text-white transition text-lg font-semibold" href="/">
          🔙 الرجوع للصفحة الرئيسية
        </a>
        <h1 className="text-lg font-semibold">💬 دردشة الذكاء الاصطناعي</h1>
      </div>

      {/* مربع الدردشة */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-800 rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-4 rounded-2xl max-w-lg shadow-lg text-lg ${
                msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-700 text-white self-start"
              }`}
            >
              {msg.sender === "bot" ? (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-400 text-center animate-pulse">...جاري المعالجة</p>}
        <div ref={messagesEndRef} />
      </div>

      {/* إدخال الرسائل */}
      <div className="p-4 bg-gray-900 border-t flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow p-3 border rounded-full bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="💬 اكتب رسالتك..."
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          🚀 إرسال
        </button>
      </div>
    </div>
  );
}
