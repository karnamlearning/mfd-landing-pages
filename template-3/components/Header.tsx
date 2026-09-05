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

const Bar = styled.header.attrs({ className: "site-header" })``;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  gap: 24px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: stretch;
  align-self: stretch;
  gap: 4px;

  @media (max-width: 980px) {
    display: none;
  }
`;

const Item = styled.div`
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  min-height: 76px;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $active }) => ($active ? "var(--accent)" : "inherit")};

  &:hover {
    color: var(--accent);
  }
`;

const Drop = styled.div<{ $open: boolean; $wide?: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: ${({ $wide }) => ($wide ? "520px" : "260px")};
  display: ${({ $wide }) => ($wide ? "grid" : "block")};
  grid-template-columns: ${({ $wide }) => ($wide ? "1fr 1fr" : "none")};
  max-height: min(72vh, 640px);
  overflow-y: auto;
  padding: 8px;
  background: var(--surface-darkest);
  color: var(--on-brand);
  border: 1px solid rgb(var(--seed-on-brand) / 0.16);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transform: translateY(${({ $open }) => ($open ? "0" : "6px")});
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: 0.18s ease;
  z-index: 20;
`;

const DropLink = styled(Link)`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 600;

  svg {
    margin-top: 2px;
    flex-shrink: 0;
    color: var(--accent);
  }

  small {
    display: block;
    margin-top: 2px;
    font-weight: 500;
    color: var(--on-brand-mute);
  }

  &:hover {
    background: rgb(var(--seed-accent) / 0.12);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 980px) {
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

  @media (max-width: 980px) {
    display: grid;
  }
`;

const Drawer = styled.div`
  display: none;
  padding: 0 0 20px;

  @media (max-width: 980px) {
    display: grid;
    gap: 6px;
  }
`;

const DrawerLink = styled(Link)`
  padding: 10px 0;
  font-weight: 650;
  border-bottom: 1px solid rgb(var(--seed-on-brand) / 0.12);
`;

const ChildLink = styled(Link)`
  padding: 8px 0 8px 14px;
  font-size: 14px;
  color: var(--on-brand-mute);
`;

function pathMatches(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
  const [solid, setSolid] = useState(pathname !== "/");
  const leaveTimer = useRef<number | null>(null);

  const clearLeave = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  useEffect(() => {
    setOpen(false);
    if (pathname !== "/") {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const closeDropdown = () => {
    clearLeave();
    setOpenMenu(null);
    setHoverLocked(true);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  useEffect(() => () => clearLeave(), []);

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
                  }, 160);
                }}
              >
                <NavLink href={item.href} $active={itemActive(item, pathname)}>
                  {item.label}
                  {item.children ? <FiChevronDown /> : null}
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
