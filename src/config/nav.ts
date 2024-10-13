import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, User, HomeIcon, HeartHandshake } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: User },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "AI Analysis",
    links: [
      {
        href: "/sleep-helper",
        title: "Sleep Helper",
        icon: HeartHandshake,
      },
    ],
  },
  {
    title: "Entities",
    links: [
      {
        href: "/sleep-logs",
        title: "Sleep Logs",
        icon: Globe,
      },
    ],
  },
];
