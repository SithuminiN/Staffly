export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-4xl font-bold text-amber-600 mb-2">403</h1>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Access Forbidden
        </p>
        <p className="text-sm text-gray-600 mb-6">
          You do not have the necessary permissions to access this page.
        </p>
        <a
          href="/users"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
