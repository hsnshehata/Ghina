import { useEffect, useState } from "react";
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
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      // Redirect to login if not logged in
      router.push("/login");
    } else {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">جاري التحميل...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8`}
    >
      <Head>
        <title>مرحبًا بك في Ghina Chat</title>
        <meta name="description" content="دردشة الذكاء الاصطناعي المتقدمة لمساعدتك!" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <header className="text-center mb-8">
        {/* Logo placeholder */}
        <h1 className="text-4xl font-bold">💬 مرحبًا بك في Ghina</h1>
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

        <a
          className="w-full bg-green-600 text-white py-3 rounded-lg text-center text-lg font-semibold hover:bg-green-700 transition"
          href="/trainings"
        >
          📚 عرض التدريبات
        </a>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-lg text-center text-lg font-semibold hover:bg-red-700 transition"
        >
          🚪 تسجيل الخروج
        </button>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© 2026 Ghina - مركز تدريب غرام سلطان</p>
      </footer>
    </div>
  );
}
