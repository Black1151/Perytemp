"use client";
import { useEffect } from "react";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { UnreadProvider } from "@/components/contexts/UnreadRecognitionContext";
import { ChakraThemeProvider } from "./ChakraThemeProvider";
import { WorkflowProvider } from "./WorkflowProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", "light");
  }, []);

  return (
    <NextAuthProvider>
      <ChakraThemeProvider>
        <WorkflowProvider>
          <UnreadProvider>{children}</UnreadProvider>
        </WorkflowProvider>
      </ChakraThemeProvider>
    </NextAuthProvider>
  );
}
