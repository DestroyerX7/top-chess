import Link from "next/link";
import Image from "next/image";
import { cn } from "cn";
import React from "react";
import { buttonVariants } from "./ui/button";

type Props = {
  isAdmin?: boolean;
} & React.ComponentProps<"header">;

export default function Header({
  isAdmin = false,
  className,
  ...props
}: Props) {
  return (
    <header
      className={cn(
        "p-4 border-b flex items-center justify-between z-50 bg-background",
        className,
      )}
      {...props}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/icon-dark.png"
          alt="Top Chess Icon Dark"
          width={32}
          height={32}
        />

        <h1 className="font-bold">Top Chess</h1>
      </Link>

      <div className="flex gap-2 items-center">
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className={buttonVariants({ variant: "ghost" })}
          >
            Dashbaord
          </Link>
        )}

        <Link
          href="https://apps.apple.com/us/app/top-chess-live-ratings/id6782492624"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/download-on-the-app-store-badge.svg"
            alt="Download on the App Store"
            width={180}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
