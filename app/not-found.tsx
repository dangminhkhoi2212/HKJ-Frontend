"use client";
import Link from 'next/link';

import { routes } from '@/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-600 text-lg mb-8">
        {"Sorry, the page you're looking for doesn't exist."}
      </p>
      <Link href={routes.home}>
        <p className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
          Return Home
        </p>
      </Link>
    </div>
  );
}
