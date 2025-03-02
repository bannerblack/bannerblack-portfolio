"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  const router = useRouter();

  // Redirect to theme settings by default
  useEffect(() => {
    router.push("/settings/theme");
  }, [router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-40">
          <p>Redirecting to theme settings...</p>
        </div>
      </CardContent>
    </Card>
  );
}
