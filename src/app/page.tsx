import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">Welcome to MeetAI</h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 1200"
        fill="none"
        className="w-48 h-48 sm:w-72 sm:h-72"
      >
        <circle cx="600" cy="600" r="600" fill="#2563EB" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M600 200C400 200 200 400 200 600C200 800 400 1000 600 1000C800 1000 1000 800 1000 600C1000 400 800 200 600 200ZM600 900C450 900 300 750 300 600C300 450 450 300 600 300C750 300 900 450 900 600C900 750 750 900 600 900Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M600 350C475 350 350 475 350 600C350 725 475 850 600 850C725 850 850 725 850 600C850 475 725 350 600 350ZM600 800C475 800 400 725 400 600C400 475 475 400 600 400C725 400 800 475 800 600C800 725 725 800 600 800Z"
          fill="white"
        />
      </svg>
      <p className="text-center text-lg max-w-md">
        Your AI-powered meeting assistant. Sign in to get started!
      </p>
      <footer className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MeetAI. All rights reserved.
      </footer>
    </div>
  );
}
