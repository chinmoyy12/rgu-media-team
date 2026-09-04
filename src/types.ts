export type RoleCategory = 
  | 'Head' 
  | 'Executive' 
  | 'Chief' 
  | 'Deputy' 
  | 'Coordinator' 
  | 'Department Head' 
  | 'Core Member';

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  category: RoleCategory;
  hierarchyOrder: number;
  photoUrl: string;
  email: string;
  bio?: string;
  socials: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface Department {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  headName: string;
  memberCount: number;
  skills: string[];
  featuredWorksCount: number;
  gradient: string;
}

export type GalleryCategory = 
  | 'All' 
  | 'Photography' 
  | 'Videography' 
  | 'Events' 
  | 'Sports' 
  | 'Festivals' 
  | 'Campus' 
  | 'Workshops' 
  | 'Cultural' 
  | 'Tech Fest';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  photographer: string;
  date: string;
  location: string;
  exif?: {
    camera?: string;
    lens?: string;
    iso?: string;
    aperture?: string;
  };
  featured?: boolean;
}

export interface Achievement {
  id: string;
  year: string;
  title: string;
  organization: string;
  description: string;
  badgeType: 'Gold' | 'Silver' | 'Bronze' | 'Special';
  counterValue?: string;
  category: string;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  quarter?: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  category: 'Faculty' | 'Students' | 'Alumni';
  quote: string;
  avatarUrl: string;
  batchOrDept: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
