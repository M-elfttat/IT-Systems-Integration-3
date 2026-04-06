import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Label } from "../components/ui";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../lib/auth";
import { getApiErrorMessage } from "../lib/api";

export function LoginPage() {
  const auth = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@sysint.local");
  const [password, setPassword] = useState("Admin123!");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
      <form
        className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          setLoading(true);
          try {
            await auth.login(email, password);
            nav("/");
          } catch (e2) {
            setErr(getApiErrorMessage(e2));
          } finally {
            setLoading(false);
          }
        }}
      >
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
              placeholder="Enter your password"
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
        </div>

        {err && (
          <div className="rounded-2xl border border-rose-300/50 bg-gradient-to-br from-rose-50 to-rose-100/50 px-4 py-3 text-sm font-medium text-rose-900 flex items-start gap-3 shadow-sm">
            <span className="text-base">⚠️</span>
            <span>{err}</span>
          </div>
        )}

        <Button disabled={loading} type="submit" className="w-full py-3 text-base font-semibold">
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="border-t border-slate-200 pt-6">
          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link className="font-semibold text-emerald-600 hover:text-emerald-700 transition select-none" to="/register">
              Create one here
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 space-y-3 text-xs shadow-sm">
          <p className="font-bold text-emerald-900">📋 Demo Credentials</p>
          <div className="space-y-2 text-emerald-800">
            <div className="bg-white/60 rounded-lg p-2 border border-emerald-100/50">
              <p className="text-xs font-semibold text-slate-700">Admin Account</p>
              <p className="font-mono text-emerald-700">admin@clinic.com / Admin123</p>
            </div>
            <div className="bg-white/60 rounded-lg p-2 border border-emerald-100/50">
              <p className="text-xs font-semibold text-slate-700">Doctor Account</p>
              <p className="font-mono text-emerald-700">sara.cardiology@sysint.local / Doctor123!</p>
            </div>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}

