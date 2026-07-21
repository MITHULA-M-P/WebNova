import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import Templates from "./pages/Templates";
import Pricing from "./pages/Pricing";
import Portfolio from "./pages/Portfolio";
import Reviews from "./pages/Reviews";
import Planner from "./pages/Planner";
import BookCall from "./pages/BookCall";
import Blueprint from "./pages/Blueprint";
import NotFound from "./pages/NotFound";

// Admin pages — NOT shown in public nav/footer
import AdminLogin from "./admin/pages/Login";
import AdminDashboard from "./admin/pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes — standalone, no Navbar or Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Public routes — wrapped with Navbar and Footer */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/planner" element={<Planner />} />
                  <Route path="/book-call" element={<BookCall />} />
                  <Route path="/blueprint" element={<Blueprint />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;