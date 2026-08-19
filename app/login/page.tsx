"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "reset">("signin");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validatePassword = (pw: string) => {
    const minLength = 6;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    return pw.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const res = await login(email, password);
    if (!res.ok) return setError(res.error || "Login failed");
    
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      return setError("Please enter your email");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (!validatePassword(newPassword)) {
      return setError("Password must be at least 6 characters and include uppercase, lowercase, a number, and a special character");
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return setError(data.error || "Reset password failed");
      }
      setSuccess("Password reset successfully. Please sign in with your new password.");
      setMode("signin");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        {mode === "signin" ? (
          <>
            <h1 className="text-2xl font-semibold mb-6 text-gray-900">Sign in</h1>
            {success && <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">{success}</div>}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </div>
              <div>
                <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
              </div>
              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
              <Button type="submit" className="w-full bg-black text-white hover:bg-orange-600 transition-colors">Sign in</Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode("reset");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sm text-orange-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-6 text-gray-900">Reset Password</h1>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </div>
              <div>
                <Input placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" required />
              </div>
              <div>
                <Input placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" required />
              </div>
              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
              <Button type="submit" className="w-full bg-black text-white hover:bg-orange-600 transition-colors">Reset Password</Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sm text-gray-600 hover:underline"
              >
                Back to Sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
