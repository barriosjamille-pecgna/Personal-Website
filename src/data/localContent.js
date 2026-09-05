// Placeholder content, structured exactly like the Supabase tables
// described in supabase/schema.sql. Swap in real rows any time —
// the components never know the difference (see src/data/contentApi.js).

export const localFolders = {
  laptop: [
    {
      id: "admin",
      name: "Admin",
      color: "#C9A24B",
      icon: "folder",
      items: [
        {
          id: "client-mgmt",
          title: "Client Management",
          description: "Placeholder — describe this project here.",
          images: [],
          tools: [],
          outcome: "",
          link: "",
        },
        {
          id: "scheduling",
          title: "Scheduling Systems",
          description: "Placeholder — describe this project here.",
          images: [],
          tools: [],
          outcome: "",
          link: "",
        },
      ],
    },
    {
      id: "tech",
      name: "Tech",
      color: "#8FBBC9",
      icon: "folder",
      items: [
        {
          id: "projects",
          title: "Projects",
          description: "Placeholder — describe this project here.",
          images: [],
          tools: [],
          outcome: "",
          link: "",
        },
        {
          id: "automation",
          title: "Automation",
          description: "Placeholder — describe this project here.",
          images: [],
          tools: [],
          outcome: "",
          link: "",
        },
      ],
    },
  ],
};

export const localWritings = [
  {
    id: "w1",
    title: "A Note Left in the Margins",
    date: "2026-01-01",
    category: "Reflection",
    body: "Placeholder writing content. Replace with your own words — this can include multiple paragraphs.",
    images: [],
    tags: ["placeholder"],
  },
];

export const localIllustrations = [
  {
    id: "i1",
    title: "Untitled Sketch",
    date: "2026-01-01",
    category: "Sketchbook",
    description: "Placeholder — describe this piece.",
    imageUrl: null,
  },
];

export const localAdvocacy = [
  {
    id: "a1",
    title: "A Cause Worth Tending",
    description: "Placeholder — describe this project or cause.",
    body: "Placeholder body text.",
    images: [],
  },
];

export const localPsychology = {
  credentials: ["Placeholder credential"],
  experience: [
    { title: "Placeholder role", org: "Placeholder org", period: "20XX–present", description: "" },
  ],
  skills: ["Placeholder skill"],
};
