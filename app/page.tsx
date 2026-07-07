import Link from "next/link";
import {
  ClipboardCheck,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-blue-400" />
              <span className="text-white font-bold text-lg">
                Team Weekly Reports
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Weekly Work Reports{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Made Simple
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 leading-relaxed">
              Submit structured weekly reports, track team progress, identify
              blockers, and analyze workload from one centralized dashboard.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-blue-600/25"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-5">
                <ClipboardCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">
                Structured Reports
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Consistent weekly report format across the team. Track completed
                tasks, planned work, blockers, and hours worked.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">
                Visual Insights
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Data-driven dashboard with charts, trends, and analytics.
                Monitor team productivity and identify bottlenecks.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-5">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">
                Role-Based Access
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Secure role-based access control for team members, managers, and
                admins. Each role has appropriate permissions.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
