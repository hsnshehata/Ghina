import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Trainings() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login"); // توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن مسجلاً
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <p className="text-center text-white mt-20">جارٍ التحقق من تسجيل الدخول...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <Head>
        <title>📚 التدريبات</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">🎓 التدريبات المتاحة</h1>

      <div className="space-y-4 w-full max-w-lg">
        <a
          className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center text-lg font-semibold hover:bg-blue-700 transition"
          href="https://www.youtube.com/results?search_query=تنظيف+البشرة"
          target="_blank"
          rel="noopener noreferrer"
        >
          🧼 تدريب تنظيف البشرة
        </a>

        <a
          className="block w-full bg-green-600 text-white py-3 rounded-lg text-center text-lg font-semibold hover:bg-green-700 transition"
          href="https://www.youtube.com/results?search_query=تصفيف+الشعر"
          target="_blank"
          rel="noopener noreferrer"
        >
          💇‍♀️ تدريب تصفيف الشعر
        </a>

        <a
          className="block w-full bg-purple-600 text-white py-3 rounded-lg text-center text-lg font-semibold hover:bg-purple-700 transition"
          href="https://www.youtube.com/results?search_query=المكياج+الاحترافي"
          target="_blank"
          rel="noopener noreferrer"
        >
          💄 تدريب المكياج الاحترافي
        </a>

        <a
          className="block w-full bg-yellow-600 text-black py-3 rounded-lg text-center text-lg font-semibold hover:bg-yellow-700 transition"
          href="https://www.youtube.com/results?search_query=تقنيات+المساج"
          target="_blank"
          rel="noopener noreferrer"
        >
          💆‍♂️ تدريب تقنيات المساج
        </a>
      </div>

      {/* زر الرجوع للصفحة الرئيسية */}
      <a
        className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-lg text-lg font-semibold hover:bg-gray-600 transition"
        href="/"
      >
        🔙 الرجوع للصفحة الرئيسية
      </a>
    </div>
  );
}
