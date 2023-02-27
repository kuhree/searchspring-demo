import { RenderableProps } from "preact";
import { SiteConfig } from "../config/site";

type HeaderProps = RenderableProps<{}>;
function Header({ children }: HeaderProps) {
  return <header class="flex justify-between py-4 px-[5%]">{children}</header>;
}

function ThemeToggle() {
  const handleToggleTheme =
    () =>
    (theme: SiteConfig["themes"][number] = "dark") => {
      document.documentElement.classList.toggle(theme);
    };

  return (
    <button onClick={handleToggleTheme}>
      <img src={SiteConfig.logo.src} alt={SiteConfig.logo.alt} class="logo" />
    </button>
  );
}

type NavProps = RenderableProps<{}>;
function NavList({ children }: NavProps) {
  return (
    <nav>
      <ul class="flex">{children}</ul>
    </nav>
  );
}

type NavItemProps = RenderableProps<{}>;
function NavItem({ children }: NavItemProps) {
  return <li class="mx-2">{children}</li>;
}

export default Object.assign(Header, {
  NavList,
  NavItem,
  ThemeToggle,
});
