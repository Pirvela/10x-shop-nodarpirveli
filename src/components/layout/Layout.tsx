import { Suspense } from "react";
import { Outlet, useLocation } from "react-router";
import ErrorBoundary from "../ErrorBoundary";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import Container from "../ui/Container";

export default function Layout() {
  const { pathname } = useLocation();
  return (
    // min-h-screen + flex-col + flex-1: footer ყოველთვის ქვემოთაა, თუნდაც გვერდი მოკლე იყოს
    <div className="flex min-h-screen flex-col bg-sun text-ink">
      <ScrollToTop />
      <Header />
      <main className="flex-1 py-8">
        <Container>
          {/* key: სხვა გვერდზე გადასვლისას Boundary თავიდან იქმნება და შეცდომა ნულდება */}
          <ErrorBoundary key={pathname}>
            {/* სანამ გვერდის chunk იტვირთება, fallback ჩანს. Header/Footer ადგილზე რჩება */}
            <Suspense
              fallback={
                <p role="status" className="text-lg font-medium">
                  Loading…
                </p>
              }
            >
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
