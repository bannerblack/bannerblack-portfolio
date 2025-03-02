import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaintbrushIcon } from "lucide-react";

interface NavbarProps {
  onThemeEditorOpen?: () => void;
}

const Navbar = ({ onThemeEditorOpen }: NavbarProps) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-5xl font-bold freight-title">
        <Link href="/everything">BlackBanner</Link>
      </h1>
    </div>
  );
};

export default Navbar;
