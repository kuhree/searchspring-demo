import { HTMLProps, PropsWithChildren } from "react";
import { useNavigation } from "react-router-dom";
import { mergeClass } from "../utils/merge-class";
import { SiteConfig } from "../utils/site-config";

type HeaderProps = PropsWithChildren &
  Pick<HTMLProps<HTMLHeadingElement>, "className">;
function HeaderContainer({ children, className }: HeaderProps) {
  const navigation = useNavigation();

  const stateClass = (() => {
    switch (navigation.state) {
      case "submitting": {
        return "submitting";
      }

      case "loading": {
        return "loading";
      }

      case "idle":
      default: {
        return "idle";
      }
    }
  })();

  return (
    <header
      className={mergeClass(
        "flex justify-between py-4 px-[5%]",
        className,
        stateClass
      )}
    >
      {children}
    </header>
  );
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

type NavProps = PropsWithChildren;
function NavList({ children }: NavProps) {
  return (
    <nav>
      <ul className="flex">{children}</ul>
    </nav>
  );
}

type NavItemProps = PropsWithChildren;
function NavItem({ children }: NavItemProps) {
  return <li className="mx-2">{children}</li>;
}

export const Header = Object.assign(HeaderContainer, {
  NavList,
  NavItem,
  ThemeToggle,
});
