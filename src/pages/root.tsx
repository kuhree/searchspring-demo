import { Header } from "../components/header";
import { Outlet } from "react-router-dom";
import { SiteConfig, SocailKeys } from "../utils/site-config";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { ReactNode } from "react";

const SocialMap: Record<SocailKeys, ReactNode> = {
  gh: <FaGithub />,
  li: <FaLinkedin />,
  tw: <FaTwitter />,
};

function AppHeader() {
  return (
    <Header className="sticky top-0">
      <Header.ThemeToggle />

      <Header.NavList>
        <Header.NavListItem>
          <Header.NavLink to="/">home</Header.NavLink>
        </Header.NavListItem>
        <Header.NavListItem>
          <Header.NavLink to="/search">search</Header.NavLink>
        </Header.NavListItem>
      </Header.NavList>
    </Header>
  );
}

function AppFooter() {
  return (
    <footer className="flex items-center justify-around py-4">
      <Header.NavList>
        {SiteConfig.socials.map(([site, href]) => (
          <Header.NavListItem key={site}>
            <Header.NavLink key={site} href={href}>
              <span className="sr-only">{site}</span>
              {SocialMap[site]}
            </Header.NavLink>
          </Header.NavListItem>
        ))}
      </Header.NavList>
    </footer>
  );
}

export function AppRoot() {
  return (
    <>
      <AppHeader />

      <main>
        <Outlet />
      </main>

      <AppFooter />
    </>
  );
}
