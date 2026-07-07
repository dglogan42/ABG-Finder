import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { ConnectPage } from "./pages/ConnectPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { FeedPage } from "./pages/FeedPage";
import { MatchesPage } from "./pages/MatchesPage";
import { ProfilePage } from "./pages/ProfilePage";

export function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}