import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import Container from "../ui/Container";

export default function Layout() {
  return (
    // min-h-screen + flex-col + flex-1: footer ყოველთვის ქვემოთაა, თუნდაც გვერდი მოკლე იყოს
    <div className="flex min-h-screen flex-col bg-sun text-ink">
      <ScrollToTop />
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
