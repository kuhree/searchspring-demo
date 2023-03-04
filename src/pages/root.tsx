import { Header } from "../components/header";
import { NavLink, NavLinkProps, Outlet } from "react-router-dom";

function AppHeader() {
  const navLinkClassName: NavLinkProps["className"] = ({
    isActive,
    isPending,
  }) => `${isActive ? "active" : ""} ${isPending ? "pending" : ""}`;

  return (
    <Header>
      <Header.ThemeToggle />

      <Header.NavList>
        <Header.NavItem>
          <NavLink to="/" className={navLinkClassName}>
            Home
          </NavLink>
        </Header.NavItem>

        <Header.NavItem>
          <NavLink to="/search" className={navLinkClassName}>
            Search
          </NavLink>
        </Header.NavItem>
      </Header.NavList>
    </Header>
  );
}

export function AppRoot() {
  return (
    <>
      <AppHeader />

      <main>
        <Outlet />
      </main>
    </>
  );
}
