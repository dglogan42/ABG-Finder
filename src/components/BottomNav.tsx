import { NavLink } from "react-router-dom";

const icons = {
  discover: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  feed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  matches: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  connect: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
};

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`} end>
        {icons.discover}
        <span>Discover</span>
      </NavLink>
      <NavLink to="/feed" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
        {icons.feed}
        <span>Feed</span>
      </NavLink>
      <NavLink to="/matches" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
        {icons.matches}
        <span>Matches</span>
      </NavLink>
      <NavLink to="/connect" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
        {icons.connect}
        <span>Connect</span>
      </NavLink>
    </nav>
  );
}