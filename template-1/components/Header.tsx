"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi";
import { FiChevronDown } from "react-icons/fi";
import { primaryNav, type NavItem } from "@/lib/site";
import { navIcons } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { ButtonLink, Container } from "@/components/ui";

/*
 * Logo on the left, a pill of nav links in the middle, the call to action on
 * the right - the layout of the reference site. The bar is translucent cream
 * and gains a hairline once the page has scrolled.
 */

const Bar = styled.header.attrs({ className: "site-header" })``;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 76px;
  gap: 24px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr auto;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface-raised);

  @media (max-width: 1080px) {
    display: none;
  }
`;

const Item = styled.div`
  position: relative;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 9px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  background: ${({ $active }) => ($active ? "var(--surface-sage)" : "transparent")};
  transition: background 0.18s ease;

  svg {
    opacity: 0.6;
  }

  &:hover {
    background: var(--surface-sage);
  }
`;

const Drop = styled.div<{ $open: boolean; $wide?: boolean }>`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: ${({ $wide }) => ($wide ? "540px" : "300px")};
  display: ${({ $wide }) => ($wide ? "grid" : "block")};
  grid-template-columns: ${({ $wide }) => ($wide ? "1fr 1fr" : "none")};
  max-height: min(72vh, 640px);
  overflow-y: auto;
  padding: 10px;
  background: var(--surface-raised);
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transform: translateY(${({ $open }) => ($open ? "0" : "8px")});
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: 0.18s ease;
  z-index: 20;

  /* Keeps the pointer inside the item while crossing the gap to the menu. */
  &::before {
    content: "";
    position: absolute;
    top: -12px;
    left: 0;
    right: 0;
    height: 12px;
  }
`;

const DropLink = styled(Link)`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;

  svg {
    margin-top: 2px;
    flex-shrink: 0;
    color: var(--accent-strong);
  }

  small {
    display: block;
    margin-top: 2px;
    font-weight: 500;
    color: var(--muted);
  }

  &:hover {
    background: var(--surface-sage);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const Burger = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  place-items: center;
  background: none;
  border: 0;
  color: inherit;
  font-size: 26px;
  cursor: pointer;
  justify-self: end;
  margin-right: -8px;

  @media (max-width: 1080px) {
    display: grid;
  }
`;

/* ---------------------------------------------------------- mobile drawer --- */

/*
 * The drawer lives inside the fixed header, so it scrolls on its own when the
 * list is taller than the screen. Sections with children fold open one at a
 * time; the section for the current page starts open.
 */
const Drawer = styled.nav`
  display: none;

  @media (max-width: 1080px) {
    display: block;
    max-height: calc(100dvh - 76px);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 4px 0 24px;
    border-top: 1px solid var(--line);
  }
`;

const DrawerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid var(--line);
`;

const DrawerLink = styled(Link)<{ $active?: boolean }>`
  flex: 1;
  min-width: 0;
  display: block;
  padding: 15px 4px;
  font-size: 17px;
  font-weight: 650;
  color: ${({ $active }) => ($active ? "var(--accent-strong)" : "var(--ink)")};
`;

const Expand = styled.button<{ $open: boolean }>`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: ${({ $open }) => ($open ? "var(--surface-sage)" : "transparent")};
  color: var(--ink);
  cursor: pointer;

  svg {
    transition: transform 0.2s ease;
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  }
`;

const DrawerChildren = styled.div`
  display: grid;
  gap: 2px;
  padding: 8px 0 14px;
  border-bottom: 1px solid var(--line);
`;

const ChildLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "var(--ink)" : "var(--muted)")};
  background: ${({ $active }) => ($active ? "var(--surface-sage)" : "transparent")};

  svg {
    flex-shrink: 0;
    color: var(--accent-strong);
  }
`;

const DrawerActions = styled.div`
  display: grid;
  gap: 10px;
  padding-top: 20px;

  a {
    width: 100%;
  }
`;

function pathMatches(href: string, pathname: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * A parent is active when its own path matches, or when any of its children do.
 * Children are not always nested under the parent href - Insights sits at /blog
 * but also owns /news and /mutual-funds - so a prefix test alone would miss them.
 */
function itemActive(item: NavItem, pathname: string) {
  return (
    pathMatches(item.href, pathname) ||
    (item.children?.some((child) => pathMatches(child.href, pathname)) ?? false)
  );
}

export function Header() {
  const pathname = usePathname();
  // The drawer remembers the path it opened on, so a navigation closes it
  // without an effect having to watch the pathname.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoverLocked, setHoverLocked] = useState(false);
  const [solid, setSolid] = useState(false);
  const leaveTimer = useRef<number | null>(null);

  const clearLeave = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => () => clearLeave(), []);

  const toggleDrawer = () => {
    if (open) {
      setOpenedAt(null);
      return;
    }
    const current = primaryNav.find((item) => item.children && itemActive(item, pathname));
    setExpanded(current?.href ?? null);
    setOpenedAt(pathname);
  };

  const closeDropdown = () => {
    clearLeave();
    setOpenMenu(null);
    setHoverLocked(true);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <Bar className={`site-header${solid || open ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <Container>
        <Row>
          <Logo />
          <Nav aria-label="Primary">
            {primaryNav.map((item) => (
              <Item
                key={item.href}
                onMouseEnter={() => {
                  clearLeave();
                  if (!hoverLocked && item.children) setOpenMenu(item.href);
                }}
                onMouseLeave={() => {
                  leaveTimer.current = window.setTimeout(() => {
                    setOpenMenu(null);
                    setHoverLocked(false);
                  }, 140);
                }}
              >
                <NavLink href={item.href} $active={itemActive(item, pathname)}>
                  {item.label}
                  {item.children ? <FiChevronDown size={14} /> : null}
                </NavLink>
                {item.children ? (
                  <Drop $open={openMenu === item.href} $wide={(item.children?.length ?? 0) > 6}>
                    {item.children.map((child) => {
                      const ChildIcon = navIcons[child.href];
                      return (
                        <DropLink key={child.href} href={child.href} onClick={closeDropdown}>
                          {ChildIcon ? <ChildIcon size={16} aria-hidden /> : null}
                          <span>
                            {child.label}
                            {child.description ? <small>{child.description}</small> : null}
                          </span>
                        </DropLink>
                      );
                    })}
                  </Drop>
                ) : null}
              </Item>
            ))}
          </Nav>
          <Actions>
            <ButtonLink href="/contact">Book a consultation</ButtonLink>
          </Actions>
          <Burger
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={toggleDrawer}
          >
            {open ? <HiOutlineX /> : <HiOutlineMenuAlt4 />}
          </Burger>
        </Row>
        {open ? (
          <Drawer id="mobile-nav" aria-label="Mobile">
            {primaryNav.map((item) => {
              const isOpen = expanded === item.href;
              return (
                <div key={item.href}>
                  <DrawerRow>
                    <DrawerLink
                      href={item.href}
                      $active={itemActive(item, pathname)}
                      onClick={() => setTimeout(() => setOpenedAt(null), 0)}
                    >
                      {item.label}
                    </DrawerLink>
                    {item.children ? (
                      <Expand
                        type="button"
                        $open={isOpen}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                        onClick={() => setExpanded(isOpen ? null : item.href)}
                      >
                        <FiChevronDown size={18} />
                      </Expand>
                    ) : null}
                  </DrawerRow>
                  {item.children && isOpen ? (
                    <DrawerChildren>
                      {item.children.map((child) => {
                        const ChildIcon = navIcons[child.href];
                        return (
                          <ChildLink
                            key={child.href}
                            href={child.href}
                            $active={pathMatches(child.href, pathname) && child.href.indexOf("#") < 0}
                            onClick={() => setTimeout(() => setOpenedAt(null), 0)}
                          >
                            {ChildIcon ? <ChildIcon size={15} aria-hidden /> : null}
                            {child.label}
                          </ChildLink>
                        );
                      })}
                    </DrawerChildren>
                  ) : null}
                </div>
              );
            })}
            <DrawerActions>
              <ButtonLink href="/contact" onClick={() => setTimeout(() => setOpenedAt(null), 0)}>
                Book a consultation
              </ButtonLink>
            </DrawerActions>
          </Drawer>
        ) : null}
      </Container>
    </Bar>
  );
}
