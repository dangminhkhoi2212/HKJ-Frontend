"use client";
import { routes } from "@/routes";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NotFound() {
  const { data: session } = useSession();

  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href={routes.home}>Return Home</Link>
    </div>
  );
}
