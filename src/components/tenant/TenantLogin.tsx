import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Tenant {
  id: string;
  email: string;
  // Add other tenant properties as needed
}

interface TenantLoginProps {
  onLoginSuccess: (tenant: Tenant) => void;
  onBackToRegister: () => void;
}

export function TenantLogin({ onLoginSuccess, onBackToRegister }: TenantLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/tenants/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      onLoginSuccess(data);
    } else {
      const err = await res.json();
      setError(err.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 space-y-6 p-6 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold text-center">Tenant Login</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <Button type="submit" className="w-full">Login</Button>
      <Button type="button" variant="outline" className="w-full" onClick={onBackToRegister}>
        Back to Registration
      </Button>
    </form>
  );
}
