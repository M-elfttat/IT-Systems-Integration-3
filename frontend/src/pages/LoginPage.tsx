import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input, Label } from "../components/ui";
import { useAuth } from "../lib/auth";
import { getApiErrorMessage } from "../lib/api";

export function LoginPage() {
  const auth = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@sysint.local");
  const [password, setPassword] = useState("Admin123!");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <div className="mb-6 space-y-1">
          <div className="text-xl font-semibold text-slate-900">Welcome back</div>
          <div className="text-sm text-slate-600">Login to continue.</div>
        </div>

        <form
          className="space-y-4"
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
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {err && <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center text-sm text-slate-600">
            No account?{" "}
            <Link className="font-medium text-indigo-700 hover:text-indigo-800" to="/register">
              Create one
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

