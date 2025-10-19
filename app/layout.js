import { Ubuntu } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import BottomBar from "@/components/bottom bar/BottomBar";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "Ubuntu",
  description: "An Operating System Simulator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.variable} antialiased w-screen h-screen relative`}
      >
        <TopBar />
        {children}
        <BottomBar />
      </body>
    </html>
  );
}
