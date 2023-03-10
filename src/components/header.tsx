import { HTMLProps, PropsWithChildren } from "react";
import {
  NavLink as RRNavLink,
  NavLinkProps as RRNavLinkProps,
  useNavigation,
} from "react-router-dom";
import { mergeClass } from "../utils/merge-class";
import { SiteConfig } from "../utils/site-config";

type HeaderProps = PropsWithChildren &
  Pick<HTMLProps<HTMLHeadingElement>, "className">;
function HeaderContainer({ children, className }: HeaderProps) {
  const navigation = useNavigation();

  const stateClass = (() => {
    const classList = new Set(["transition-colors", "border-b-4"]);
    switch (navigation.state) {
      case "submitting":
      case "loading": {
        classList.add("border-accent");
        break;
      }

      case "idle":
      default: {
        classList.add("border-muted");
        break;
      }
    }

    return [...classList].join(" ");
  })();

  return (
    <header
      className={mergeClass(
        "flex items-center justify-between py-2 px-[5%] shadow-xl z-50 bg-primary",
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
    const theme = "dark";
    const isActive = classList.toggle(theme);

    if (isActive) localStorage.setItem("theme", theme);
    else localStorage.removeItem("theme");
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
      <ul className="flex items-center">{children}</ul>
    </nav>
  );
}

type NavItemProps = PropsWithChildren;
function NavListItem({ children }: NavItemProps) {
  return <li className="mx-1 flex items-center">{children}</li>;
}

type NavLinkProps = PropsWithChildren<
  RRNavLinkProps | HTMLProps<HTMLAnchorElement>
>;

function NavLink({ children, className, ...props }: NavLinkProps) {
  const baseClass = mergeClass(
    "transition-colors px-2 py-1",
    "hover:text-accent hover:scale-110"
  );

  const withActiveClassName: RRNavLinkProps["className"] = (args) => {
    const { isActive, isPending } = args;

    return mergeClass(
      baseClass,
      typeof className === "function" ? className(args) : className,
      `${isActive ? "text-accent" : ""} ${isPending ? "text-muted" : ""}`
    );
  };

  if ("href" in props && props.href) {
    return (
      <a className={baseClass} {...props}>
        {children}
      </a>
    );
  } else if ("to" in props && props.to) {
    return (
      <RRNavLink className={withActiveClassName} {...props}>
        {children}
      </RRNavLink>
    );
  }

  throw new Error("Invalid NavLink", {
    cause: new Error("Property `to` OR `href` is required"),
  });
}

export const Header = Object.assign(HeaderContainer, {
  NavList,
  NavListItem,
  NavLink,
  ThemeToggle,
});
