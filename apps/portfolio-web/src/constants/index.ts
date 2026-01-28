import {
  web,
  javascript,
  html,
  css,
  reactjs,
  tailwind,
  git,
  GPT,
  Resto,
  YT,
  typescript,
  redux,
  mongodb,
  Next,
  promptWorld,
  nodejs,
  express,
  iconGithub,
} from "../assets";

// Type definitions
export interface NavLink {
  id: string;
  title: string;
}

export interface Service {
  title: string;
  icon: string;
}

export interface Technology {
  name: string;
  icon: string;
}

export interface ProjectTech {
  name: string;
  color: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: ProjectTech[];
  image: string;
  source_code_link: string;
  demo_link: string;
  category: 'frontend' | 'fullstack' | 'tools';
}

export interface Experience {
  title: string;
  company_name: string;
  icon: string;
  iconBg: string;
  date: string;
  points: string[];
}

export interface Testimonial {
  testimonial: string;
  name: string;
  designation: string;
  company: string;
  image: string;
}

export const navLinks: NavLink[] = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "skills",
    title: "Skills",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services: Service[] = [
  {
    title: "JavaScript Developer",
    icon: javascript,
  },
  {
    title: "React Developer",
    icon: reactjs,
  },
  {
    title: "Front-End Developer",
    icon: web,
  },
];

const technologies: Technology[] = [
  {
    name: "HTML 5",
    icon: html || '',
  },
  {
    name: "CSS 3",
    icon: css || '',
  },
  {
    name: "JavaScript",
    icon: javascript || '',
  },
  {
    name: "TypeScript",
    icon: typescript || '',
  },
  {
    name: "React JS",
    icon: reactjs || '',
  },
  {
    name: "Next JS",
    icon: Next || '',
  },
  {
    name: "Redux/RTK",
    icon: redux || '',
  },
  {
    name: "MongoDB",
    icon: mongodb || '',
  },
  {
    name: "Node.js",
    icon: nodejs || '',
  },
  {
    name: "Express.js",
    icon: express || '',
  },
  {
    name: "Tailwind CSS",
    icon: tailwind || '',
  },
  {
    name: "Git",
    icon: git || '',
  },
  {
    name: "GitHub",
    icon: iconGithub || '',
  },
];

const projects: Project[] = [
  {
    name: "Youtube-Player",
    description:
      "Developed a YouTube Player in React.js for easy video watching. Added a search tool to find related videos quickly using RapidAPI integration.",
    technologies : [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "API",
        color: "green-text-gradient",
      },
      {
        name: "RapidAPI",
        color: "pink-text-gradient",
      },
    ],
    image: YT,
    source_code_link: "https://github.com/spexzee/YouTube",
    demo_link: "https://spexzee-youtube.vercel.app/",
    category: "frontend",
  },
  {
    name: "Prompt-World",
    description:
      "Discover & Share AI-Powered Prompts. A full-stack application with Next.js, NextAuth for authentication, and MongoDB for data storage. Features OAuth integration and CRUD operations.",
    technologies : [
      {
        name: "next.js",
        color: "blue-text-gradient",
      },
      {
        name: "next-Auth",
        color: "green-text-gradient",
      },
      {
        name: "MongoDB",
        color: "pink-text-gradient",
      },
      {
        name: "OAuth",
        color: "blue-text-gradient",
      },
    ],
    image: promptWorld,
    source_code_link: "https://github.com/spexzee/prompt-world",
    demo_link: "https://spexzee-prompt.netlify.app/",
    category: "fullstack",
  },
  {
    name: "GPT-3 Overview",
    description:
      "Developed a React Front-End landing website. Implemented user-friendly design and navigation, utilizing React components for modularity and code reusability.",
    technologies : [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "front-end",
        color: "pink-text-gradient",
      },
    ],
    image: GPT,
    source_code_link: "https://github.com/spexzee/GPT-3",
    demo_link: "https://gpt-spexzee.netlify.app/",
    category: "frontend",
  },
  {
    name: "Restaurant",
    description:
      "Demonstrated React.js proficiency for a visually appealing, responsive website, ensuring an enhanced user experience and effective online presence.",
    technologies : [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "front-end",
        color: "pink-text-gradient",
      },
    ],
    image: Resto,
    source_code_link: "https://github.com/spexzee/Restaurant-",
    demo_link: "https://spexzee-restaurant.netlify.app/",
    category: "frontend",
  },
  {
    name: "React PDF Hook",
    description:
      "A production-ready React hook for generating high-fidelity PDFs with advanced layout control. Features precision PDF generation, automatic page breaks, and flexible content targeting. Published as NPM package @spexzee/react-pdfhook.",
    technologies: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "npm",
        color: "green-text-gradient",
      },
      {
        name: "pdf",
        color: "pink-text-gradient",
      },
      {
        name: "typescript",
        color: "blue-text-gradient",
      },
    ],
    image: nodejs, // Using nodejs icon as placeholder - you might want to add a custom PDF icon
    source_code_link: "https://github.com/spexzee/react-pdfhook",
    demo_link: "https://www.npmjs.com/package/@spexzee/react-pdfhook",
    category: "tools",
  },
];

const experiences: Experience[] = [
  {
    title: "Software Developer",
    company_name: "Ornate Interior Decor",
    icon: reactjs,
    iconBg: "#383E56",
    date: "September 2023 - Present",
    points: [
      "Designed and maintained company and client projects using React.js, TypeScript, and Next.js, enhancing user experience, accessibility, and SEO performance.",
      "Contributed most of production code after joining, driving development of new features and functionality.",
      "Optimized legacy codebases for improved performance, reducing load times and enhancing scalability.",
      "Implemented efficient state management with Redux, Redux-Saga, and React Query, ensuring robust data flow and application reliability.",
      "Developed dynamic, responsive interfaces with Material-UI, delivering high-quality user interactions and consistent design.",
      "Built and optimized backend APIs with Node.js, Express, and MongoDB, supporting seamless frontend integration.",
      "Ensured code quality through comprehensive testing with Jest and Playwright, minimizing bugs and improving maintainability.",
    ],
  },
];
const testimonials: Testimonial[] = [];

export { services, technologies, experiences, testimonials, projects };
