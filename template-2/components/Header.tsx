"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi";
import { FiChevronDown } from "react-icons/fi";
import { primaryNav, site, type NavItem } from "@/lib/site";
import { navIcons } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { ButtonLink, Container } from "@/components/ui";

/**
 * A quiet letterhead bar: serif wordmark, plain text links, the phone number
 * in text, and one dark button. Transparent over the cream hero and frosted
 * once the page scrolls.
 */
const Bar = styled.header.attrs<{ $solid: boolean; $open: boolean }>(({ $solid, $open }) => ({
  className: ["site-header", $solid ? "is-solid" : "", $open ? "is-open" : ""]
    .filter(Boolean)
    .join(" "),
}))<{ $solid: boolean; $open: boolean }>``;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 78px;
  gap: 32px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const Item = styled.div`
  position: relative;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 13px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "var(--ink)" : "rgb(var(--seed-ink) / 0.72)")};
  transition: color 0.15s ease;

  &:hover {
    color: var(--ink);
  }
`;

/*
 * The wrapper starts flush with the nav link and carries the visual gap as
 * padding, so the pointer never leaves the item on its way down to the menu.
 */
const Drop = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  padding-top: 10px;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transform: translateY(${({ $open }) => ($open ? "0" : "6px")});
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: 0.18s ease;
`;

const DropInner = styled.div<{ $wide?: boolean }>`
  min-width: ${({ $wide }) => ($wide ? "520px" : "280px")};
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
`;

const DropLink = styled(Link)`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);

  svg {
    margin-top: 2px;
    flex-shrink: 0;
    color: var(--brand);
  }

  small {
    display: block;
    margin-top: 3px;
    font-size: 12.5px;
    line-height: 1.45;
    font-weight: 400;
    color: var(--muted);
  }

  &:hover {
    background: var(--surface-alt);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const PhoneLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  @media (max-width: 1240px) {
    display: none;
  }

  &:hover {
    color: var(--brand);
  }
`;

const Burger = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  place-items: center;
  margin-right: -8px;
  background: none;
  border: 0;
  color: var(--ink);
  font-size: 26px;
  cursor: pointer;

  @media (max-width: 1100px) {
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

  @media (max-width: 1100px) {
    display: block;
    max-height: calc(100dvh - 78px);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 2px 0 28px;
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
  font-family: var(--font-display);
  font-size: 24px;
  line-height: 1.1;
  color: ${({ $active }) => ($active ? "var(--brand)" : "var(--ink)")};
`;

const Expand = styled.button<{ $open: boolean }>`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: ${({ $open }) => ($open ? "var(--surface-alt)" : "transparent")};
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
  border-radius: 8px;
  font-size: 15px;
  color: ${({ $active }) => ($active ? "var(--ink)" : "var(--muted)")};
  background: ${({ $active }) => ($active ? "var(--surface-alt)" : "transparent")};

  svg {
    flex-shrink: 0;
    color: var(--brand);
  }
`;

const DrawerActions = styled.div`
  display: grid;
  gap: 14px;
  padding-top: 22px;

  a {
    width: 100%;
  }
`;

const DrawerPhone = styled.a`
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
`;

function pathMatches(href: string, pathname: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

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
  const [solid, setSolid] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoverLocked, setHoverLocked] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
    setOpenMenu(null);
    setHoverLocked(true);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <Bar $solid={solid} $open={open}>
      <Container>
        <Row>
          <Logo compact />
          <Nav aria-label="Primary">
            {primaryNav.map((item) => (
              <Item
                key={item.href}
                onMouseEnter={() => {
                  if (!hoverLocked && item.children) setOpenMenu(item.href);
                }}
                onMouseLeave={() => {
                  setOpenMenu(null);
                  setHoverLocked(false);
                }}
              >
                <NavLink href={item.href} $active={itemActive(item, pathname)}>
                  {item.label}
                </NavLink>
                {item.children ? (
                  <Drop $open={openMenu === item.href}>
                    <DropInner $wide={(item.children?.length ?? 0) > 6}>
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
                    </DropInner>
                  </Drop>
                ) : null}
              </Item>
            ))}
          </Nav>
          <Actions>
            <PhoneLink href={site.phoneHref}>{site.phone}</PhoneLink>
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
                      onClick={() => setOpenedAt(null)}
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
                            onClick={() => setOpenedAt(null)}
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
              <DrawerPhone href={site.phoneHref}>{site.phone}</DrawerPhone>
              <ButtonLink href="/contact" onClick={() => setOpenedAt(null)}>
                Book a consultation
              </ButtonLink>
            </DrawerActions>
          </Drawer>
        ) : null}
      </Container>
    </Bar>
  );
}
