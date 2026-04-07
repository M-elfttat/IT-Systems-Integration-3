import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../components/common";

export default function PublicLayout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="container"><Outlet /></main>
      <Footer />
    </div>
  );
}
