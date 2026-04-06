import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input, Label } from "../components/ui";
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

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <div className="mb-6 space-y-1">
          <div className="text-xl font-semibold text-slate-900">Create account</div>
          <div className="text-sm text-slate-600">Register as a patient.</div>
        </div>

        <form
          className="space-y-4"
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
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ahmed Ali" />
          </div>
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
              placeholder="min 6 characters"
            />
          </div>

          {err && <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Creating..." : "Create account"}
          </Button>

          <div className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-medium text-indigo-700 hover:text-indigo-800" to="/login">
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

