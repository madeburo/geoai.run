export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Analyzer", href: "/analyze" },
  { label: "GitHub", href: "https://github.com/madeburo/GEO-AI", external: true },
  { label: "Documentation", href: "#", external: true },
  { label: "Specification", href: "/specification" },
];
