import { Ubuntu } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/topBar/TopBar";
import BottomBar from "@/components/bottomBar/BottomBar";
import AppManagerProvider from "@/contexts/AppManagerContext";

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
        <AppManagerProvider>
          <TopBar />
          {children}
          <BottomBar />
        </AppManagerProvider>
      </body>
    </html>
  );
}
