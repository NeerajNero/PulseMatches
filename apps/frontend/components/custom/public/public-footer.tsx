import { ROUTES } from "@/utils/route";

const cityLinks = [
  { label: "Bengaluru", href: "/locations/bengaluru" },
  { label: "Hyderabad", href: "/locations/hyderabad" },
  { label: "Chennai", href: "/locations/chennai" },
  { label: "Mumbai", href: "/locations/mumbai" }
];

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div>
        <a className="brand" href={ROUTES.HOME}>
          <span className="brand-mark" aria-hidden="true">MF</span>
          <span>MatchFlow Arena</span>
        </a>
        <p>
          Original tournament discovery software for community sports, club events,
          and organizers preparing structured match days.
        </p>
      </div>
      <nav aria-label="Footer tournaments">
        <h2>Tournaments</h2>
        <a href={ROUTES.TOURNAMENTS}>All tournaments</a>
        {cityLinks.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
      <nav aria-label="Footer company">
        <h2>Company</h2>
        <a href={ROUTES.ABOUT}>About</a>
        <a href={ROUTES.CONTACT}>Contact</a>
        <a href={ROUTES.PRIVACY}>Privacy</a>
        <a href={ROUTES.TERMS}>Terms</a>
      </nav>
    </footer>
  );
}

