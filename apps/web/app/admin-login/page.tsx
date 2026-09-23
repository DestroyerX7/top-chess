"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { loginAdmin } from "../actions/auth";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (password.length < 1) {
        return;
      }

      await toast.promise(
        (async () => {
          const result = await loginAdmin(password);

          if (!result.success) {
            throw new Error(result.error.message);
          }

          return result.data;
        })(),
        {
          loading: "Logging in as admin...",
          success: () => {
            router.push("/admin/dashboard");

            return "Successfully logged in as admin";
          },
          error: (error: unknown) =>
            error instanceof Error ? error.message : "Something went wrong",
        },
      );
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-row items-center">
      <Card className="w-1/4 mx-auto">
        <CardHeader>
          <CardTitle>Login as Admin</CardTitle>

          <CardDescription>
            Enter admin password to continue to the admin dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
