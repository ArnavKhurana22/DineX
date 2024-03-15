"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

function ViewModel(src) {
  return <model-viewer src={src} ar camera-controls className="border" style={{ width: "100%", height: "100%" }}></model-viewer>
}

export default function Home() {
  const [screen, setScreen] = useState(0);

  return (
    <main className="h-full bg-black p-1 lg:p-4">
      <section className="h-screen bg-black border rounded-3xl"><ViewModel src="/arduino_uno.glb" /></section>
    </main >
  );
}
