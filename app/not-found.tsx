import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-2xl mb-4">
        404
      </div>
      <h2 className="text-2xl font-black tracking-tight text-slate-900">Page Not Found</h2>
      <p className="text-sm font-semibold text-slate-500 max-w-sm mt-2 mb-6 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all"
      >
        Return to Home Page
      </Link>
    </div>
  );
}
