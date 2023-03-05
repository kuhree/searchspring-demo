import { Header } from "../components/header";
import { Outlet } from "react-router-dom";
import { SiteConfig } from "../utils/site-config";

function AppHeader() {
  return (
    <Header className="sticky top-0 bg-muted">
      <Header.ThemeToggle />

      <Header.NavList>
        <Header.NavListItem>
          <Header.NavLink to="/">home</Header.NavLink>
        </Header.NavListItem>

        {SiteConfig.social.map(([site, href]) => (
          <Header.NavListItem key={site}>
            <Header.NavLink key={site} href={href}>
              {site}
            </Header.NavLink>
          </Header.NavListItem>
        ))}
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
