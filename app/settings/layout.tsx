import { ReactNode } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/settings/profile"
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/settings/theme"
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Theme
              </Link>
              <Link
                href="/settings/account"
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Account
              </Link>
              <Link
                href="/settings/notifications"
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Notifications
              </Link>
            </nav>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-3">{children}</div>
    </div>
  );
}
