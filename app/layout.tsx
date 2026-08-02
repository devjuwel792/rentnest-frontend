import "./globals.css";
import type { Metadata } from "next";
import ReduxProvider from "@/lib/redux/ReduxProvider";

export const metadata: Metadata = {
  title: {
    default: "RentNest",
    template: "%s | RentNest",
  },
  description:
    "Find & list rental properties with ease. RentNest connects tenants and landlords.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
