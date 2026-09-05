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
  background: none;
  border: 0;
  color: inherit;
  font-size: 26px;
  cursor: pointer;
  justify-self: end;

  @media (max-width: 1080px) {
    display: grid;
  }
`;

const Drawer = styled.div`
  display: none;
  padding-bottom: 24px;

  @media (max-width: 1080px) {
    display: grid;
    gap: 6px;
  }
`;

const DrawerLink = styled(Link)`
  padding: 10px 4px;
  font-weight: 650;
  border-bottom: 1px solid var(--line);
`;

const ChildLink = styled(Link)`
  padding: 8px 4px 8px 14px;
  font-size: 14px;
  color: var(--muted);
`;

function pathMatches(href: string, pathname: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * A parent is active when its own path matches, or when any of its children do.
 * Children are not always nested under the parent href - Insights sits at /blog
 * but also owns /news and /faqs - so a prefix test alone would miss them.
 */
function itemActive(item: NavItem, pathname: string) {
  return (
    pathMatches(item.href, pathname) ||
    (item.children?.some((child) => pathMatches(child.href, pathname)) ?? false)
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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

  useEffect(() => () => clearLeave(), []);

  const closeDropdown = () => {
    clearLeave();
    setOpenMenu(null);
    setHoverLocked(true);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <Bar className={`site-header${solid || open ? " is-solid" : ""}`}>
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
          <Burger aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            {open ? <HiOutlineX /> : <HiOutlineMenuAlt4 />}
          </Burger>
        </Row>
        {open ? (
          <Drawer>
            {primaryNav.map((item) => (
              <div key={item.href}>
                <DrawerLink href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </DrawerLink>
                {item.children?.map((child) => (
                  <ChildLink key={child.href} href={child.href} onClick={() => setOpen(false)}>
                    {child.label}
                  </ChildLink>
                ))}
              </div>
            ))}
            <ButtonLink href="/contact" onClick={() => setOpen(false)}>
              Book a consultation
            </ButtonLink>
          </Drawer>
        ) : null}
      </Container>
    </Bar>
  );
}
