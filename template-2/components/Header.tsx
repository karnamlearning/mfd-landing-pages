"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi";
import { FiPhone, FiChevronDown } from "react-icons/fi";
import { primaryNav, site, type NavItem } from "@/lib/site";
import { navIcons } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { ButtonLink, Container } from "@/components/ui";

const Bar = styled.header.attrs({ className: "site-header" })``;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  gap: 24px;
  padding: 0 18px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;

  @media (max-width: 1180px) {
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
  padding: 8px 9px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "var(--ink)" : "var(--muted)")};

  &:hover {
    color: var(--ink);
  }
`;

const Drop = styled.div<{ $open: boolean; $wide?: boolean }>`
  position: absolute;
  top: calc(100% - 2px);
  left: 0;
  min-width: ${({ $wide }) => ($wide ? "540px" : "280px")};
  display: ${({ $wide }) => ($wide ? "grid" : "block")};
  grid-template-columns: ${({ $wide }) => ($wide ? "1fr 1fr" : "none")};
  max-height: min(72vh, 640px);
  overflow-y: auto;
  padding: 12px;
  background: var(--surface-raised);
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: var(--shadow);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transform: translateY(${({ $open }) => ($open ? "0" : "8px")});
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: 0.18s ease;
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
    color: var(--accent);
  }

  small {
    display: block;
    margin-top: 2px;
    font-weight: 500;
    color: var(--muted);
  }

  &:hover {
    background: var(--surface);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 1180px) {
    display: none;
  }
`;

const PhonePill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  font-size: 13px;
  font-weight: 650;
  color: var(--ink);
  white-space: nowrap;

  @media (max-width: 1320px) {
    display: none;
  }

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
`;

const Burger = styled.button`
  display: none;
  background: none;
  border: 0;
  color: var(--ink);
  font-size: 26px;
  cursor: pointer;

  @media (max-width: 1180px) {
    display: grid;
  }
`;

const Drawer = styled.div`
  display: none;
  padding: 0 18px 20px;

  @media (max-width: 1180px) {
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

  const closeDropdown = () => {
    setOpenMenu(null);
    setHoverLocked(true);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <Bar>
      <Container>
        <div className="header-shell">
        <Row>
          <Logo />
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
                  {item.children ? <FiChevronDown /> : null}
                </NavLink>
                {item.children ? (
                  <Drop $open={openMenu === item.href} $wide={(item.children?.length ?? 0) > 6}>
                    {item.children.map((child) => {
                      const ChildIcon = navIcons[child.href];
                      return (
                        <DropLink
                          key={child.href}
                          href={child.href}
                          onClick={closeDropdown}
                        >
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
            <PhonePill href={site.phoneHref}>
              <FiPhone /> {site.phone}
            </PhonePill>
            <ButtonLink href="/contact">Book a consultation</ButtonLink>
          </Actions>
          <Burger
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
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
        </div>
      </Container>
    </Bar>
  );
}
