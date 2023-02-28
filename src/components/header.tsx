import { RenderableProps } from "preact";
import { SiteConfig } from "../config/site";

type HeaderProps = RenderableProps<{}>;
function HeaderContainer({ children }: HeaderProps) {
  return <header class="flex justify-between py-4 px-[5%]">{children}</header>;
}

function ThemeToggle() {
  const handleToggleTheme = () => {
    const classList = document.documentElement.classList;
    const currentTheme = SiteConfig.themes.find((theme) =>
      classList.contains(theme)
    );

    if (currentTheme) {
      classList.toggle(currentTheme);
    } else {
      classList.add(SiteConfig.themes[0]);
    }
  };

  return (
    <button onClick={handleToggleTheme}>
      <img src={SiteConfig.logo.src} alt={SiteConfig.logo.alt} />
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

export const Header = Object.assign(HeaderContainer, {
  NavList,
  NavItem,
  ThemeToggle,
});
