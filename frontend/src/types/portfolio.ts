export interface Project {
  id: number;
  // Legacy static data fields
  image?: string;
  name?: string;
  demoUrl?: string;
  // API dynamic fields from backend
  title?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  isFeatured?: boolean;
  // Common fields
  category: string;
  description: string;
  technologies: string[] | string;
}
