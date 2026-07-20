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

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;