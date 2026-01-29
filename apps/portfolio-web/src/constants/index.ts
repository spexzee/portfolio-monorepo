import {
  web,
  javascript,
  reactjs,
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
  _id?: string;
  name: string;
  description: string;
  technologies: ProjectTech[];
  image: string;
  source_code_link: string;
  demo_link: string;
  category: 'frontend' | 'fullstack' | 'tools';
}

export interface Experience {
  _id?: string;
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

const testimonials: Testimonial[] = [];

export { services, testimonials };
