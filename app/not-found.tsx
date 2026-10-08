import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 text-center"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
