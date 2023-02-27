import { SiteConfig } from "./config/site";
import Header from "./components/header";

function AppHeader() {
  return (
    <Header>
      <Header.ThemeToggle />

      <Header.NavList>
        <Header.NavItem>
          <a href="/">Home</a>
        </Header.NavItem>

        <Header.NavItem>
          <a href="/search">Search</a>
        </Header.NavItem>
      </Header.NavList>
    </Header>
  );
}

export function App() {
  return (
    <>
      <AppHeader />

      <section class="text-center">
        <h1 class="text-3xl font-bold">{SiteConfig.title}</h1>
        <p class="text-gray-600">{SiteConfig.description}</p>
      </section>
    </>
  );
}
