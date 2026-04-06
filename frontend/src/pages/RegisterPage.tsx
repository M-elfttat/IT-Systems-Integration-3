import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Label } from "../components/ui";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../lib/auth";
import { getApiErrorMessage } from "../lib/api";

export function RegisterPage() {
  const auth = useAuth();
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout title="Create your account" subtitle="Join us and start booking appointments today.">
      <form
        className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          setLoading(true);
          try {
            await auth.register(fullName, email, password);
            nav("/");
          } catch (e2) {
            setErr(getApiErrorMessage(e2));
          } finally {
            setLoading(false);
          }
        }}
      >
        <div>
          <Label>Full Name</Label>
          <Input 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            placeholder="John Anderson" 
            required
          />
        </div>

        <div>
          <Label>Email Address</Label>
          <Input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="your.email@example.com" 
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition select-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">At least 6 characters recommended</p>
        </div>

        {err && (
          <div className="rounded-2xl border border-rose-300/50 bg-gradient-to-br from-rose-50 to-rose-100/50 px-4 py-3 text-sm font-medium text-rose-900 flex items-start gap-3 shadow-sm">
            <span className="text-base">⚠️</span>
            <span>{err}</span>
          </div>
        )}

        <Button disabled={loading} type="submit" className="w-full py-3 text-base font-semibold">
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <div className="border-t border-slate-200 pt-6">
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-emerald-600 hover:text-emerald-700 transition select-none" to="/login">
              Sign in
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-cyan-50/50 p-4 space-y-3 text-xs shadow-sm">
          <p className="font-bold text-blue-900">📋 What you get</p>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">✓</span>
              <span>Browse and book appointments with top doctors</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">✓</span>
              <span>Manage your healthcare all in one place</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-blue-600">✓</span>
              <span>Secure account with encrypted data protection</span>
            </div>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}


