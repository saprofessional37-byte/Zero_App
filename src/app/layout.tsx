import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZERO - The Anti-Advice App",
  description:
    "Forced Scarcity. One idea. No escape. Execute or kill it. No alternatives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="font-mono antialiased">
          <header className="flex justify-end p-4 gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-white text-black hover:bg-neutral-200 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
