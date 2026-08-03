"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main>
      <h1>Gestion de patrimoine CSZIAM</h1>
      <button onClick={() => router.push("/login")}>login</button>
    </main>
  );
}