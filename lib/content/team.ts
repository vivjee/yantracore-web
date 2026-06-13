export interface TeamMember {
  id: string;
  name: string;
  role: string;
  /** Path to headshot — placeholder initials used until real photo provided */
  photo?: string;
  initials: string;
  /** Short one-liner shown on hover */
  bio?: string;
  isManagement: boolean;
}

/**
 * 8 team members: 5 staff + 3 management.
 * Real headshots go in public/images/team/ and are referenced here.
 * Until headshots are provided, the GlassCard renders initials.
 */
export const team: TeamMember[] = [
  // Management (3)
  {
    id: "mgmt-1",
    name: "Placeholder Name",
    role: "Founder & CEO",
    initials: "PN",
    bio: "Founded YantraCore to prove that software, built with craft, can move the world.",
    isManagement: true,
  },
  {
    id: "mgmt-2",
    name: "Placeholder Name",
    role: "CTO",
    initials: "PN",
    bio: "Architects the systems that power everything YantraCore ships.",
    isManagement: true,
  },
  {
    id: "mgmt-3",
    name: "Placeholder Name",
    role: "Head of Design",
    initials: "PN",
    bio: "Responsible for every pixel feeling intentional.",
    isManagement: true,
  },
  // Staff (5)
  {
    id: "staff-1",
    name: "Placeholder Name",
    role: "Lead Engineer",
    initials: "PN",
    bio: "Turns ambitious specs into shipping code.",
    isManagement: false,
  },
  {
    id: "staff-2",
    name: "Placeholder Name",
    role: "Full Stack Engineer",
    initials: "PN",
    bio: "Equally at home in a database schema or a Figma file.",
    isManagement: false,
  },
  {
    id: "staff-3",
    name: "Placeholder Name",
    role: "AI Engineer",
    initials: "PN",
    bio: "Builds the agent systems that make Jimbo tick.",
    isManagement: false,
  },
  {
    id: "staff-4",
    name: "Placeholder Name",
    role: "Mobile Engineer",
    initials: "PN",
    bio: "Native iOS and React Native, shipping both.",
    isManagement: false,
  },
  {
    id: "staff-5",
    name: "Placeholder Name",
    role: "DevOps Engineer",
    initials: "PN",
    bio: "Keeps the lights on — elegantly.",
    isManagement: false,
  },
];
