export interface Resume {
  id: number;
  name: string;
  email: string;
  phone: string;
  education: string[];
  experience: string[];
  skills: string[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
  }[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
} 