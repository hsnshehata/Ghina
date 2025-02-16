import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
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
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8`}>
      <Head>
        <title>مرحبًا بك في Grham Chat</title>
        <meta name="description" content="دردشة الذكاء الاصطناعي المتقدمة لمساعدتك!" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <header className="text-center">
        <Image className="mx-auto" src="/logo.png" alt="Grham Chat Logo" width={120} height={120} priority />
        <h1 className="text-3xl font-bold mt-4">💬 مرحبًا بك في مركز تدريب غرام سلطان</h1>
        <p className="text-gray-400 text-lg mt-2">ابدأ باستخدام الذكاء الاصطناعي لمساعدتك</p>
      </header>

      {/* Main Content */}
      <main className="mt-8 flex flex-col items-center space-y-6 w-full max-w-lg">
        <a
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-center text-lg font-semibold hover:bg-blue-700 transition"
          href="/chat"
        >
          🚀 بدء المحادثة الآن
        </a>

        {/* زر التدريبات */}
        <a
          className="w-full bg-green-600 text-white py-3 rounded-lg text-center text-lg font-semibold hover:bg-green-700 transition"
          href="/trainings"
        >
          🎓 الدخول إلى التدريبات
        </a>

        <div className="flex gap-4 w-full justify-center">
          <a
            className="border border-gray-600 hover:border-gray-400 px-5 py-2 rounded-lg text-white text-sm hover:bg-gray-800 transition"
            href="https://www.gharamsoltan.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            📖 تصفح موقعنا لمعرفة التطورات
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Gharam Soltan Team. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
