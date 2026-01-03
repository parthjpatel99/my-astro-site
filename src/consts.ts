// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

interface SocialLink {
  href: string;
  label: string;
}

interface Site {
  website: string;
  author: string;
  profile: string;
  desc: string;
  title: string;
  ogImage: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  scheduledPostMargin: number;
  showArchives: boolean;
  showBackButton: boolean;
  editPost: {
    enabled: boolean;
    text: string;
    url: string;
  };
  dynamicOgImage: boolean;
  lang: string;
  timezone: string;
}

// Site configuration
export const SITE: Site = {
  website: "https://parthjpatel.me/",
  author: "Parth Janakbhai Patel",
  profile: "https://parthjpatel.me/about",
  desc: "Software Engineer | Kotlin, Java, Python, C#, TypeScript, C++ | Spring Boot, Node.js, Microservices, Docker, Kubernetes, Azure, GCP",
  title: "Parth Janakbhai Patel",
  ogImage: "parth-avatar.jpg", // Needs replacement or upload
  lightAndDarkMode: true,
  postPerIndex: 10,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: true,
    text: "Edit on GitHub",
    url: "https://github.com/parthjpatel99/my-astro-site/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en",
  timezone: "America/Phoenix", // Tucson, AZ
};

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.desc;

// Navigation links
export const NAV_LINKS: SocialLink[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/posts",
    label: "Blog",
  },
];

// Social media links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://github.com/parthjpatel99",
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/parthjpatel99",
    label: "LinkedIn",
  },
  {
    href: "mailto:parth8199@gmail.com",
    label: "Email",
  },
];

// Icon map for social media
export const ICON_MAP: Record<string, string> = {
  GitHub: "github",
  LinkedIn: "linkedin",
  Email: "mail",
};
