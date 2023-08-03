import { Example } from "./Example";
import { Question1, UserProvider } from "./Question1";
import { Question2, UserCreditProvider } from "./Question2";
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
      <Link to="example">Example</Link>
    </div>
  );
};

export const AppProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const { children } = props;

  return (
    <UserProvider>
      <UserCreditProvider>
        <BrowserRouter>
          <>{children}</>
        </BrowserRouter>
      </UserCreditProvider>
    </UserProvider>
  );
};

export function App() {
  return (
    <AppProvider>
      <RouteHeader />
      <Routes>
        <Route path="1" Component={Question1} />
        <Route path="2" Component={Question2} />
        <Route path="example" Component={Example} />
      </Routes>
    </AppProvider>
  );
}
