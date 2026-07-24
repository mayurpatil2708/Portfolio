import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools - Mayur Patil",
  description:
    "Circuit Line — an interactive street lighting voltage drop calculator and circuit layout tool built by Mayur Patil, Traffic Systems Design Engineer.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
