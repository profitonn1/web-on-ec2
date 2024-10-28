// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import Appbar2 from "../../components/Appbar2";
// import SideAppbar from "../../components/SideAppbar";
import DashAppbar from "../components/DashAppbar"
import ProtectedRoute from "../ProtectedRoute";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <ProtectedRoute>
        <DashAppbar />
        {children}
        </ProtectedRoute>
      </body>
    </html>
  )
}
