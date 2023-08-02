import { Question1, UserProvider } from "./Question1";
import { Question2 } from "./Question2";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const ROUTE_HEADER_STYLE: React.CSSProperties = {
  display: "flex",
  gap: "2rem",
};

export const RouteHeader = () => {
  return (
    <div style={ROUTE_HEADER_STYLE}>
      <Link to="1">Question 1</Link>
      <Link to="2">Question 2</Link>
    </div>
  );
};

export function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <RouteHeader />
        <Routes>
          <Route path="1" Component={Question1} />
          <Route path="2" Component={Question2} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
