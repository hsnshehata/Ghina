import { useEffect } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/"); // توجيه المستخدم إلى الصفحة الرئيسية بدلًا من الدردشة
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("❌ خطأ أثناء تسجيل الدخول:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🔐 تسجيل الدخول</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        🚀 تسجيل الدخول باستخدام Google
      </button>
    </div>
  );
}
