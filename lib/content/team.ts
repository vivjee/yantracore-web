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
 * 8 team members: 3 management + 5 staff.
 *
 * Names below are representative placeholders (Nepal-based studio) so the page
 * reads as real until the actual roster + headshots are confirmed. Real
 * headshots go in public/images/team/ and are referenced via `photo`; until
 * then the card renders `initials`.
 */
export const team: TeamMember[] = [
  // Management (3)
  {
    id: "mgmt-1",
    name: "Aarav Shrestha",
    role: "Founder & CEO",
    initials: "AS",
    bio: "Founded YantraCore to prove that software, built with craft, can move the world.",
    isManagement: true,
  },
  {
    id: "mgmt-2",
    name: "Bibek Gurung",
    role: "CTO",
    initials: "BG",
    bio: "Architects the systems that power everything YantraCore ships.",
    isManagement: true,
  },
  {
    id: "mgmt-3",
    name: "Priya Maharjan",
    role: "Head of Design",
    initials: "PM",
    bio: "Responsible for every pixel feeling intentional.",
    isManagement: true,
  },
  // Staff (5)
  {
    id: "staff-1",
    name: "Sandeep Thapa",
    role: "Lead Engineer",
    initials: "ST",
    bio: "Turns ambitious specs into shipping code.",
    isManagement: false,
  },
  {
    id: "staff-2",
    name: "Anjali Rai",
    role: "Full Stack Engineer",
    initials: "AR",
    bio: "Equally at home in a database schema or a Figma file.",
    isManagement: false,
  },
  {
    id: "staff-3",
    name: "Nabin Adhikari",
    role: "AI Engineer",
    initials: "NA",
    bio: "Builds the agent systems that make Jimbo tick.",
    isManagement: false,
  },
  {
    id: "staff-4",
    name: "Sujata Karki",
    role: "Mobile Engineer",
    initials: "SK",
    bio: "Native iOS and React Native, shipping both.",
    isManagement: false,
  },
  {
    id: "staff-5",
    name: "Rohan Tamang",
    role: "DevOps Engineer",
    initials: "RT",
    bio: "Keeps the lights on — elegantly.",
    isManagement: false,
  },
];
