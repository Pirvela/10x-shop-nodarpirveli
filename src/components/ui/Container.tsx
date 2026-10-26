import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode; //
}

// ცენტრირებული, მაქსიმალური სიგანის ბლოკი. შიგთავსს მშობელი გადასცემს
export default function Container({ children }: ContainerProps) {
  return <div className="mx-auto w-full max-w-6xl px-4">{children}</div>;
}
