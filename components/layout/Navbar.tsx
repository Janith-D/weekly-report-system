"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardCheck, LogOut, Menu, X, User } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = (session?.user as any)?.role;

  const navLinks: { label: string; href: string; roles: string[] }[] = [
    {
      label: "Dashboard",
      href: role === "ADMIN" ? "/admin/dashboard" : role === "MANAGER" ? "/manager/dashboard" : "/member/dashboard",
      roles: ["TEAM_MEMBER", "MANAGER", "ADMIN"],
    },
    {
      label: "My Reports",
      href: "/member/reports",
      roles: ["TEAM_MEMBER", "MANAGER", "ADMIN"],
    },
    {
      label: "Team Reports",
      href: "/manager/reports",
      roles: ["MANAGER", "ADMIN"],
    },
    {
      label: "Projects",
      href: "/manager/projects",
      roles: ["MANAGER", "ADMIN"],
    },
    {
      label: "Analytics",
      href: "/manager/analytics",
      roles: ["MANAGER", "ADMIN"],
    },
    {
      label: "Users",
      href: "/admin/users",
      roles: ["ADMIN"],
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-900 font-bold text-lg"
            >
              <ClipboardCheck className="w-6 h-6 text-blue-600" />
              <span className="hidden sm:inline">Team Weekly Reports</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks
                .filter((link) => link.roles.includes(role))
                .map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{session?.user?.name}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
                  {role?.replace("_", " ")}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2">
            {navLinks
              .filter((link) => link.roles.includes(role))
              .map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            <div className="border-t border-gray-100 mt-3 pt-3 px-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <User className="w-4 h-4" />
                <span>{session?.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
