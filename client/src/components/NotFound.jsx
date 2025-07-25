import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center p-10">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-4">Oops! Page not found.</p>
      <Link to="/" className="mt-6 inline-block text-blue-500 underline">
        Go back to Home
      </Link>
    </div>
  );
}
