export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-2">401</h1>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Unauthorized Access
        </p>
        <p className="text-sm text-gray-600 mb-6">
          You need to log in with valid credentials to view this resource.
        </p>
        <a
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
