import { ROUTES } from "@/utils/route";

export function PublicHeader() {
  return (
    <header className="topbar listing-topbar" aria-label="Main navigation">
      <a className="brand" href={ROUTES.HOME}>
        <span className="brand-mark" aria-hidden="true">MF</span>
        <span>MatchFlow Arena</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href={ROUTES.TOURNAMENTS}>Tournaments</a>
        <a href={ROUTES.ABOUT}>About</a>
        <a href={ROUTES.CONTACT}>Contact</a>
        <a href={ROUTES.LOGIN}>Log in</a>
        <a className="nav-cta" href={ROUTES.SIGNUP}>Sign up</a>
      </nav>
    </header>
  );
}

