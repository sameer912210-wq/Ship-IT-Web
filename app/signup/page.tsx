"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (pw: string) => {
    const minLength = 6;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    return pw.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) return setError("Passwords do not match");
    if (!validatePassword(password)) return setError("Password does not meet complexity rules");

    const res = await signup({ fullName, phone, email, address, password });
    if (!res.ok) return setError(res.error || "Signup failed");
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        <Input placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
}
