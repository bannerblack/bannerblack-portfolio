"use server";

import { getUserInfo } from "../query/auth";
import { getAuthorStories, getAuthorInteractions } from "../query/queries";
import ThemeTest from "./ThemeTest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default async function Home() {
  const userInfo = await getUserInfo();
  const authorStories = await getAuthorStories();
  const authorInteractions = await getAuthorInteractions();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-4">Welcome to BlackBanner</h1>
        <p className="text-lg mb-6">
          Your fiction portfolio with customizable themes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Theme Card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Theme Showcase</CardTitle>
              <CardDescription>
                See your current theme in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This card displays your current theme settings.
              </p>
              <div className="flex space-x-2">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </CardContent>
          </Card>

          {/* Author Card */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Author" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Author Profile</CardTitle>
                  <CardDescription>Manage your author settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>Customize your author profile and theme preferences.</p>
            </CardContent>
            <CardFooter>
              <Button>Edit Profile</Button>
            </CardFooter>
          </Card>

          {/* Stories Card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Your Stories</CardTitle>
              <CardDescription>Manage your fiction portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Create, edit, and organize your stories in one place.</p>
            </CardContent>
            <CardFooter>
              <Button>Browse Stories</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Theme Variables</h2>
        <p className="mb-4">
          Below you can see how your current theme affects different UI
          elements:
        </p>
        <Card className="p-4">
          <ThemeTest />
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Data Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-96 bg-muted p-2 rounded">
                {JSON.stringify(userInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authors</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-96 bg-muted p-2 rounded">
                {JSON.stringify(authorStories, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Author Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-96 bg-muted p-2 rounded">
                {JSON.stringify(authorInteractions, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
