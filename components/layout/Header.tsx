"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const [isResetMode, setIsResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const validatePassword = (pw: string) => {
    const minLength = 6;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    return pw.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handlePopupResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);

    if (newPassword !== confirmPassword) {
      return setResetError("Passwords do not match");
    }
    if (!validatePassword(newPassword)) {
      return setResetError("Password must be at least 6 characters and include uppercase, lowercase, a number, and a special character");
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return setResetError(data.error || "Reset failed");
      }
      setResetSuccess("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsResetMode(false);
        setResetSuccess(null);
      }, 1500);
    } catch (err) {
      setResetError("Network error");
    }
  };

  const handleSignout = async () => {
    try {
      await logout();
      alert("Signed out successfully");
      setIsProfileOpen(false);
    } catch (e) {
      console.error("Signout error:", e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOutsideDesktop = !desktopRef.current || !desktopRef.current.contains(target);
      const clickedOutsideMobile = !mobileRef.current || !mobileRef.current.contains(target);

      if (isProfileOpen && clickedOutsideDesktop && clickedOutsideMobile) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  const isActivePath = (path: string) => pathname === path;

  const navItems = [
    ...(user ? [{ href: "/orders", label: "Your Orders" }] : []),
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          : "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8 lg:space-x-12">
            <Link
              className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
              href="/"
              aria-label="Ship-IT Home"
            >
              SHIP<span className="text-primary">-IT</span>
            </Link>

            <nav
              className="hidden md:flex items-center space-x-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(href)
                      ? "bg-orange-100 shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  aria-current={isActivePath(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form className="relative w-full" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                aria-label="Search products"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:flex items-center space-x-2">
              {user ? (
                <div ref={desktopRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    Welcome <span className="font-semibold text-black">{user.fullName}</span>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-80 z-50 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsResetMode(false);
                          setResetError(null);
                          setResetSuccess(null);
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        aria-label="Close details"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      {!isResetMode ? (
                        <>
                          <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg mb-2 shadow-inner">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-base font-semibold text-gray-900">{user.fullName}</h2>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>

                          <div className="py-3 space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Phone:</span>
                              <span className="font-medium text-gray-900">{user.phone || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Address:</span>
                              <span className="font-medium text-gray-900 max-w-[150px] truncate text-right" title={user.address}>
                                {user.address || "Not provided"}
                              </span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                            <Button
                              onClick={() => {
                                setIsResetMode(true);
                                setResetError(null);
                                setResetSuccess(null);
                              }}
                              variant="outline"
                              size="sm"
                              className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              Reset Password
                            </Button>
                            <Button
                              onClick={handleSignout}
                              variant="destructive"
                              size="sm"
                              className="w-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                              Sign Out
                            </Button>
                          </div>
                        </>
                      ) : (
                        <form onSubmit={handlePopupResetPassword} className="space-y-3 pt-2">
                          <h3 className="text-sm font-semibold text-gray-900">Reset Password</h3>
                          {resetSuccess && <div className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">{resetSuccess}</div>}
                          <Input
                            placeholder="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="text-xs h-8"
                          />
                          <Input
                            placeholder="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="text-xs h-8"
                          />
                          {resetError && <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{resetError}</div>}
                          <div className="flex gap-2 pt-2">
                            <Button
                              type="button"
                              onClick={() => {
                                setIsResetMode(false);
                                setResetError(null);
                                setResetSuccess(null);
                              }}
                              variant="outline"
                              size="sm"
                              className="w-1/2 text-xs"
                            >
                              Cancel
                            </Button>
                            <Button type="submit" size="sm" className="w-1/2 text-xs bg-black text-white hover:bg-orange-600">
                              Update
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" variant="default" className="text-sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {isSearchOpen && (
          <div className="lg:hidden mt-4 animate-in slide-in-from-top duration-200">
            <form className="relative" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                aria-label="Search products"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>
        )}

        {isMobileOpen && (
          <nav
            className="md:hidden mt-4 animate-in slide-in-from-top duration-200"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-3 pb-4 border-b border-gray-200">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobileMenu}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                    isActivePath(href)
                      ? "bg-orange-100"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  aria-current={isActivePath(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>

            {user ? (
              <div ref={mobileRef} className="flex flex-col space-y-3 pt-4 sm:hidden border-t border-gray-100 relative">
                <button
                  onClick={() => {
                    setIsProfileOpen((prev) => !prev);
                  }}
                  className="w-full text-left py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Welcome <span className="font-semibold text-black">{user.fullName}</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute left-0 right-0 mt-2 z-50 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsResetMode(false);
                        setResetError(null);
                        setResetSuccess(null);
                      }}
                      className="absolute top-4 right-4 p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                      aria-label="Close details"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {!isResetMode ? (
                      <>
                        <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
                          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg mb-2 shadow-inner">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <h2 className="text-base font-semibold text-gray-900">{user.fullName}</h2>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>

                        <div className="py-3 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Phone:</span>
                            <span className="font-medium text-gray-900">{user.phone || "Not provided"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Address:</span>
                            <span className="font-medium text-gray-900 max-w-[180px] truncate text-right" title={user.address}>
                              {user.address || "Not provided"}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                          <Button
                            onClick={() => {
                              setIsResetMode(true);
                              setResetError(null);
                              setResetSuccess(null);
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            Reset Password
                          </Button>
                          <Button
                            onClick={handleSignout}
                            variant="destructive"
                            size="sm"
                            className="w-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </>
                    ) : (
                      <form onSubmit={handlePopupResetPassword} className="space-y-3 pt-2">
                        <h3 className="text-sm font-semibold text-gray-900">Reset Password</h3>
                        {resetSuccess && <div className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">{resetSuccess}</div>}
                        <Input
                          placeholder="New Password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="text-xs h-8"
                        />
                        <Input
                          placeholder="Confirm Password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="text-xs h-8"
                        />
                        {resetError && <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{resetError}</div>}
                        <div className="flex gap-2 pt-2">
                          <Button
                            type="button"
                            onClick={() => {
                              setIsResetMode(false);
                              setResetError(null);
                              setResetSuccess(null);
                            }}
                            variant="outline"
                            size="sm"
                            className="w-1/2 text-xs"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" size="sm" className="w-1/2 text-xs bg-black text-white hover:bg-orange-600">
                            Update
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4 sm:hidden">
                <Button variant="outline" className="w-full text-sm" asChild>
                  <Link href="/login" onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full text-sm" variant="default" asChild>
                  <Link href="/signup" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>

    </header>
  );
}
