import Link from 'next/link';
import Button from '@/app/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <h1 className="text-5xl font-extrabold mb-4 text-center">
        Hey! Glad you're here 👋
      </h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Meet VoidAI – your friendly AI assistant that helps you code, create media, and explore new ideas, all in one place.
      </p>
      <Link href="/chat">
        <Button className="px-8 py-3 text-lg font-medium rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors">
          Get Started
        </Button>
      </Link>
    </div>
  );
}
