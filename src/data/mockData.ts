import { Department, FAQItem, GalleryItem, TeamMember, Achievement, TimelineMilestone, Testimonial } from '../types';

export const teamMembers: TeamMember[] = [
  {
    id: 'mem-1',
    name: 'Jitumoni Das',
    position: 'Faculty Coordinator',
    department: 'Leadership & Administration',
    category: 'Head',
    hierarchyOrder: 1,
    photoUrl: 'https://i.ibb.co/CsppbfG8/cropped-circle-image.png',
    email: 'jitumoni.das@rgu.ac.in',
    bio: `The Visionary of Assam
An Inspiring Profile of Dr. Kaayann JD

Dr. Kaayann JD (born Jitumoni Das) stands as a modern-day renaissance man in Assam’s cultural landscape. A visionary director, writer, composer, and cultural activist from Nahira, Lower Assam—and the proud son of the late Akan Chandra Das and Mrs. Lakshmipriya Das— his life is a powerful testament to the indomitable human will and the belief that true art is rooted in a profound love for one’s people.

The Theatrical Forge: A Journey of Relentless Practice
His artistic awakening took a decisive turn following a transformative theatre workshop organized by the National School of Drama (NSD). Rather than resting on the knowledge gained, he forged his own creative identity through grueling, relentless practice and deep self-discipline. He drew immense inspiration from the profound physical theatre traditions of Padma Shri Heisnam Kanhailal and Padma Shri Ratan Thiyam, seamlessly weaving their indigenous, spiritual depth with the dynamic, expressive techniques of European and North American physical theatre styles.

This rigorous dedication led him to found the esteemed repertory Creative Mind. His unmistakable craftsmanship quickly made him a sought-after mentor, serving as camp director, acting expert, and faculty across numerous workshops for NSD (TIE Company/ANGANA), Gauhati University, Axom Natya Xanmilan, and NSUI across Jamugurihat, Jharobori, Silpukhuri, and his native Nahira.

A Revolution in Assamese Media
Transitioning his storytelling prowess to the screen, he learned the craft intimately as an assistant director to the late Assamese cine legend Bidyut Chakraborty (Andhere Se Ujale Ki Aour, Gandhi Ahisil, Prahari, Sougandh, Jiyai Thokar Axare). His talent eventually took him to the country's dream world, Mumbai, working with Filmitch Production on the Hindi feature film Baromas. Yet, driven by an untiring love for his homeland, he left the glitz of Bollywood to return to Assam—a decision that sparked a revolution in regional broadcasting.

His trailblazing career across television and film includes:
• Pioneering Storytelling: Directing, writing, and editing the groundbreaking true-story serial Vastab (NE Hi-Fi); creating celebrated serials and telefilms like Akash Chuboloi Mon (Director/Editor, Prag News), Dawar (DY365), Dainy, and Mohayodha (video film editor); and co-directing Hai Hai (Rengoni TV).
• Broadcast Leadership: Shaping the industry as a Senior Producer, Director, and Creative Director at Prag News, where he spearheaded a massive channel restructuring, launched 13 new multi-genre programs, and directed the iconic 2014–15 promos. He also directed serials for Rengoni TV and served as Producer at DY365 (DY Bihurani 2011 & 2012) and for Bindaas Masti (NE Hi-Fi).
• Cinematography & Commercial Vision: Serving as Director of Photography for the short film Xopunpriya and the music video Madhukantha; co-directing John Abraham’s North East United FC promotional music video; and directing and editing major TV commercials for Kinsberg Golf Accessories, King Chilly & Hotel Gateway Grandeur, and Disang Resort.

The Polymath: Music, Literature, and Technical Mastery
Dr. Kaayann JD’s creative footprint extends far beyond the camera. He is a prolific literary voice, having authored Swogokti and translated Dr. Surjya Kumar Bhuyan’s Podya Buranji. As a lyricist and composer, he has penned and scored over 50 Assamese songs spanning folk, classical, hip-hop, R&B, pop, and modern genres.

This creative breadth is anchored by an absolute mastery of technology. He is highly proficient across an arsenal of industry-standard software—including FCP, Premiere Pro, DaVinci Resolve, InDesign, Logic Pro, FL Studio, Cubase, RipX, and Studio One—while maintaining expert command over all formats of still and video camera operation.

Cultivating the Grassroots and Building a Legacy
Today, he continues to light the way for the next generation. While leading media endeavors at Royal Global University’s Royal Times, he has imparted his wisdom as faculty and guest coordinator at the Gauhati University Centre for Performing Arts, AIMT Guwahati, NPS International School, and JNV Doomordolong.

In recognition of his monumental contributions to art and society, he was conferred an Honorary Doctorate by Integrated Global University in 2025, formally presented in August 2026 by Meghalaya's ex-Cabinet Minister Alexander Laloo Hek.

Yet, he has never forgotten his roots. In his native village of Nahira, he founded FolkLAB—a visionary cultural sanctuary providing the local community with free, expert-led training in folk music, dance, theatre, and literature. In every endeavor, Dr. Kaayann JD proves that with enough passion, hard work, and vision, one person can indeed elevate the cultural consciousness of an entire state.`,
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'mem-2',
    name: 'Ashiqul Haque',
    position: 'VCD',
    department: 'Executive Board',
    category: 'Executive',
    hierarchyOrder: 2,
    photoUrl: 'https://i.ibb.co/S4zn91Kb/Whats-App-Image-2026-08-05-at-8-06-59-PM-2.png',
    email: 'ashiqul.haque@rgu.ac.in',
    bio: 'Overseeing multi-departmental operations, festival coverages, and brand collaborations for Royal Global University.',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com'
    }
  },
  {
    id: 'mem-3',
    name: 'Akib Irfan',
    position: 'Chief (Admin)',
    department: 'Student Body Council',
    category: 'Chief',
    hierarchyOrder: 3,
    photoUrl: 'https://i.ibb.co/GQw6RWpp/Whats-App-Image-2026-08-05-at-8-07-02-PM.png',
    email: 'akib.irfan@rgu.ac.in',
    bio: 'Leading student creative leads, event broadcasts, and digital campaigns across campus.',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'mem-4',
    name: 'Bedanga Malakar',
    position: 'Editing Cell Head',
    department: 'Operations & Planning',
    category: 'Deputy',
    hierarchyOrder: 4,
    photoUrl: 'https://i.ibb.co/ZpcnBW4M/cropped-circle-image-3.png',
    email: 'esha.konwar@rgu.ac.in',
    bio: 'Managing event schedules, crew deployments, and cross-functional quality assurance.',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'mem-5',
    name: 'Chinmoy Thakuria',
    position: 'Chief (Videography & Editing)',
    department: 'Social Media Management',
    category: 'Deputy',
    hierarchyOrder: 5,
    photoUrl: 'https://i.ibb.co/rf2n40yt/Whats-App-Image-2026-08-03-at-9-37-36-PM.png',
    email: 'chinmoy.thakuria@rgu.ac.in',
    bio: 'As the Deputy Head of the Media Team, I oversee creative operations, coordinate team members, and help ensure smooth execution of photography, videography, and digital media projects. I focus on maintaining quality, fostering collaboration, and delivering impactful visual content that represents our university and its events with professionalism and creativity.',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'mem-6',
    name: 'GARGI SHARMA',
    position: 'Councillor',
    department: 'Media Logistics',
    category: 'Coordinator',
    hierarchyOrder: 6,
    photoUrl: 'https://i.ibb.co/TDJy1B59/Whats-App-Image-2026-08-05-at-8-07-02-PM-1.png',
    email: 'gargi.sarma@rgu.ac.in',
    bio: 'Coordinating press releases, official media liaisons, and event passes.',
    socials: {
      instagram: 'https://instagram.com'
    }
  },
  {
    id: 'mem-7',
    name: 'Transmarine K Kashyap',
    position: 'Councillor',
    department: 'Media Logistics',
    category: 'Coordinator',
    hierarchyOrder: 7,
    photoUrl: 'https://i.ibb.co/3yJPwnvv/Whats-App-Image-2026-08-05-at-8-07-01-PM.png',
    email: 'transmarine.kashyap@rgu.ac.in',
    bio: 'Ensuring seamless technical support, broadcast gear management, and post-event archiving.',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'mem-8',
    name: 'Adhbujya K Kalita',
    position: 'Head of Videography',
    department: 'Videography',
    category: 'Department Head',
    hierarchyOrder: 8,
    photoUrl: 'https://i.ibb.co/mCp71xRr/Whats-App-Image-2026-08-05-at-8-07-03-PM.png',
    email: 'adhbujya.kalita@rgu.ac.in',
    bio: 'Director of official aftermovies, documentary shorts, and high-framerate sports coverage.',
    socials: {
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com'
    }
  },

  {
    id: 'mem-10',
    name: 'Amanna Rahman',
    position: 'Head of Reel',
    department: 'Reels & Short-form Content',
    category: 'Department Head',
    hierarchyOrder: 10,
    photoUrl: 'https://i.ibb.co/pv37kvpV/Whats-App-Image-2026-08-05-at-8-07-00-PM.png',
    email: 'amanna.rahman@rgu.ac.in',
    bio: 'Creating trend-setting vertical videos and creative cultural montages for Instagram.',
    socials: {
      instagram: 'https://instagram.com'
    }
  },
  {
    id: 'mem-11',
    name: 'JONTI DAS',
    position: 'Chief (Photography)',
    department: 'Photography',
    category: 'Department Head',
    hierarchyOrder: 11,
    photoUrl: 'https://i.ibb.co/qYbhrmGJ/IMG-20250913-132723-jpg.png',
    email: 'joonti.das@rgu.ac.in',
    bio: 'Every photograph tells a story, but the best ones preserve a legacy. As the Photography Head , I, Jonti Das, have spent the last four years pursuing photography as both a profession and a passion, specializing in wildlife and animal photography. The patience and perspective I have gained continue to shape the way I see the world through my lens. My vision for the Photography Cell is to create more than beautiful photographs—we strive to become the visual storytellers of our university, capturing its milestones, achievements, emotions, and the countless moments that define campus life. Together, we foster creativity, teamwork, and continuous learning, ensuring that every frame not only documents a moment but also reflects the spirit, identity, and legacy of our institution.',
    socials: {
      instagram: 'https://instagram.com'
    }
  },
  {
    id: 'mem-12',
    name: 'Priyanuj Tamuli',
    position: 'Head of Podcast',
    department: 'Podcast & Audio',
    category: 'Department Head',
    hierarchyOrder: 12,
    photoUrl: 'https://i.ibb.co/m5gCprhq/cropped-circle-image-2.png',
    email: 'bulbul.hussain@rgu.ac.in',
    bio: 'Host and director of "Podcasts", for managing the interface and equipments while interviewing guest dignitaries, faculty, and student achievers.',
    socials: {
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com'
    }
  },
  {
    id: 'mem-13',
    name: 'Mehak Kayum',
    position: 'Head of Mobile Photography',
    department: 'Mobile Photography',
    category: 'Department Head',
    hierarchyOrder: 13,
    photoUrl: 'https://i.ibb.co/NdfQS0dc/Whats-App-Image-2026-08-01-at-7-58-41-PM.png',
    email: 'mehak.kayum@rgu.ac.in',
    bio: "I'm Mehak Kayum, Head of Mobile Photography. I believe great stories don't need expensive gear—they need creativity, perspective, and heart. Whether I'm shooting on my phone, directing content, creating reels, or planning a shoot, my goal is always the same: to create visuals that people genuinely connect with. I want this team to be a space where everyone feels free to experiment, learn, and grow. For me, photography is more than capturing moments—it's about telling stories that feel real. Let's create something meaningful, together.",
    socials: {
      instagram: 'https://instagram.com'
    }
  },
  {
    id: 'mem-14',
    name: 'Abhik Das',
    position: 'Head of Content Design',
    department: 'Content Design & Graphics',
    category: 'Department Head',
    hierarchyOrder: 14,
    photoUrl: 'https://i.ibb.co/qM0tLB1S/cropped-circle-image-1.png',
    email: 'harshita.deka@rgu.ac.in',
    bio: "Abhik Das\nContent Design Head\nDepartment of Applied Psychology | 5th Semester\nAssam Royal Global University\n\nAs the Content Design Head, I lead the creation of engaging digital content that promotes the University’s Media Team and highlights campus events, achievements, and initiatives. Through creative storytelling, graphic design, photography, videography, and social media management, I ensure impactful visual communication that strengthens the Media Team’s presence and enhances the University’s digital identity.",
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  }
];

export const departmentsData: Department[] = [
  {
    id: 'dept-photography',
    title: 'Photography',
    shortDesc: 'Capturing timeless moments with professional DSLR & Mirrorless optics.',
    fullDesc: 'The Photography wing documents every milestone across campus—from Convocation ceremonies and international conferences to cultural festivals and athletic meets.',
    iconName: 'Camera',
    headName: 'JONTI DAS',
    memberCount: 18,
    skills: ['Portraiture', 'Sports Photography', 'Event Lighting', 'Adobe Lightroom Classic', 'Color Grading'],
    featuredWorksCount: 450,
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'dept-videography',
    title: 'Videography',
    shortDesc: 'Cinematic storytelling, aftermovies, and broadcast videography.',
    fullDesc: 'Producing high-definition 4K aftermovies, documentary features, aerial drone footage, and official university teaser films.',
    iconName: 'Video',
    headName: 'Adhbujya K Kalita',
    memberCount: 14,
    skills: ['4K Video Shooting', 'DaVinci Resolve', 'Drone Cinematography', 'Audio Syncing', 'Color Match'],
    featuredWorksCount: 220,
    gradient: 'from-red-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'dept-reels',
    title: 'Reels & Shorts',
    shortDesc: 'Trend-setting, fast-paced vertical video content for social platforms.',
    fullDesc: 'Crafting engaging micro-content that captures youth culture, behind-the-scenes moments, and viral campus trends.',
    iconName: 'Smartphone',
    headName: 'Kyal Sin Phyu & Amanna Rahman',
    memberCount: 16,
    skills: ['CapCut Pro', 'Vertical Motion Design', 'Trending Audio Edit', 'Beat Syncing', 'Social Hooks'],
    featuredWorksCount: 680,
    gradient: 'from-orange-500/20 via-amber-500/10 to-transparent'
  },
  {
    id: 'dept-podcast',
    title: 'Podcast & Audio',
    shortDesc: 'Broadcasting student voices, faculty insights, and guest interviews.',
    fullDesc: 'Host of "Royal Talks Podcast", featuring multi-microphone studio setups, sound design, and guest spotlight conversations.',
    iconName: 'Mic',
    headName: 'Priyanuj Tamuli',
    memberCount: 8,
    skills: ['Multi-Mic Sound Setup', 'Audition / Logic Pro', 'Interview Hosting', 'Acoustic Engineering'],
    featuredWorksCount: 48,
    gradient: 'from-purple-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'dept-content-design',
    title: 'Content Design',
    shortDesc: 'Copywriting, digital storytelling, and creative content curation.',
    fullDesc: 'Crafting press releases, social media captions, magazine editorials, and compelling storytelling frameworks.',
    iconName: 'FileText',
    headName: 'Abhik Das',
    memberCount: 12,
    skills: ['Copywriting', 'SEO Writing', 'Editorial Planning', 'Brand Tone Alignment'],
    featuredWorksCount: 310,
    gradient: 'from-emerald-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'dept-graphic-design',
    title: 'Graphic Design',
    shortDesc: 'High-impact visual identity, event posters, and digital artwork.',
    fullDesc: 'Creating visual branding for mega cultural fests, academic symposia, social media banners, and print publications.',
    iconName: 'Palette',
    headName: 'Abhik Das (Lead)',
    memberCount: 15,
    skills: ['Adobe Photoshop', 'Illustrator', 'Figma', 'Typography', 'Brand Identity Systems'],
    featuredWorksCount: 520,
    gradient: 'from-blue-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'dept-mobile-photo',
    title: 'Mobile Photography',
    shortDesc: 'On-the-go candid coverage and real-time story highlights.',
    fullDesc: 'Leveraging mobile computational photography for instantaneous event updates and behind-the-scenes candid clips.',
    iconName: 'SmartphoneNfc',
    headName: 'Mehak Kayum',
    memberCount: 12,
    skills: ['Computational Photography', 'Snapseed & Lightroom Mobile', 'Story Composition'],
    featuredWorksCount: 890,
    gradient: 'from-pink-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'dept-social-media',
    title: 'Social Media Management',
    shortDesc: 'Strategic distribution, analytics, and digital engagement.',
    fullDesc: 'Managing official RGU channels across Instagram, Facebook, YouTube, LinkedIn, and X with data-driven engagement tactics.',
    iconName: 'Share2',
    headName: 'Chinmoy Thakuria & Akib Irfan',
    memberCount: 10,
    skills: ['Meta Business Suite', 'Analytics & Insights', 'Community Management', 'Campaign Strategy'],
    featuredWorksCount: 1200,
    gradient: 'from-cyan-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'dept-documentation',
    title: 'Documentation & Archives',
    shortDesc: 'Preserving historical archives, media assets, and press logs.',
    fullDesc: 'Cataloging high-resolution media vaults, press clippings, and official university historical archives.',
    iconName: 'Archive',
    headName: 'GARGI SHARMA',
    memberCount: 9,
    skills: ['Digital Asset Management', 'Metadata Tagging', 'Press Archiving', 'Cloud Storage Systems'],
    featuredWorksCount: 950,
    gradient: 'from-indigo-500/20 via-orange-500/10 to-transparent'
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Royal Global Annual Convocation 2025',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Joonti Das',
    date: 'February 14, 2025',
    location: 'Main Auditorium, RGU Guwahati',
    exif: { camera: 'Sony Alpha A7 IV', lens: 'FE 24-70mm f/2.8 GM II', iso: '400', aperture: 'f/2.8' },
    featured: true
  },
  {
    id: 'gal-2',
    title: 'Consortia Tech Fest - Cyber Stage Laser Show',
    category: 'Tech Fest',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Adhbujya K Kalita',
    date: 'November 22, 2024',
    location: 'Open Air Amphitheatre',
    exif: { camera: 'Canon EOS R5', lens: 'RF 15-35mm f/2.8L', iso: '1600', aperture: 'f/2.8' },
    featured: true
  },
  {
    id: 'gal-3',
    title: 'Bihu Cultural Symphony Performance',
    category: 'Cultural',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Mehak Kayum',
    date: 'April 15, 2025',
    location: 'Cultural Pavilion',
    exif: { camera: 'iPhone 15 Pro Max', lens: '24mm equiv', iso: '200', aperture: 'f/1.78' },
    featured: true
  },
  {
    id: 'gal-4',
    title: 'Inter-University Football Championship Finals',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Joonti Das',
    date: 'January 18, 2025',
    location: 'Royal Sports Complex',
    exif: { camera: 'Sony A1', lens: 'FE 100-400mm f/4.5-5.6 GM', iso: '800', aperture: 'f/5.6' },
    featured: true
  },
  {
    id: 'gal-5',
    title: 'Royal Campus at Sunset - Golden Hour',
    category: 'Campus',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Transmarine K Kashyap',
    date: 'March 02, 2025',
    location: 'Betkuchi Campus Hillside',
    exif: { camera: 'DJI Mavic 3 Pro', lens: '24mm Hasselblad', iso: '100', aperture: 'f/2.8' },
    featured: true
  },
  {
    id: 'gal-6',
    title: 'International Media Workshop with Industry Experts',
    category: 'Workshops',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Abhik Das',
    date: 'December 10, 2024',
    location: 'Seminar Hall B',
    exif: { camera: 'Sony A7S III', lens: 'FE 50mm f/1.2 GM', iso: '640', aperture: 'f/1.8' }
  },
  {
    id: 'gal-7',
    title: 'Ecstasia Spring Youth Festival Aftermovie Shoot',
    category: 'Festivals',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Kyal Sin Phyu',
    date: 'March 25, 2025',
    location: 'RGU Central Lawn',
    exif: { camera: 'Sony FX3', lens: 'FE 35mm f/1.4 GM', iso: '1280', aperture: 'f/1.4' }
  },
  {
    id: 'gal-8',
    title: 'Royal Talks Podcast Live Recording Session',
    category: 'Videography',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Priyanuj Tamuli',
    date: 'January 28, 2025',
    location: 'Media Studio 1',
    exif: { camera: 'Blackmagic Pocket 6K Pro', lens: 'Sigma 18-35mm', iso: '400', aperture: 'f/1.8' }
  }
];

export const achievementsData: Achievement[] = [
  {
    id: 'ach-1',
    year: '2025',
    title: 'Best University Media Unit in Northeast India',
    organization: 'National Student Media Conclave 2025',
    description: 'Awarded 1st Place for exceptional event coverage, short-form storytelling, and real-time digital broadcasting.',
    badgeType: 'Gold',
    counterValue: '#1 Media Team',
    category: 'National Award'
  },
  {
    id: 'ach-2',
    year: '2024',
    title: 'Excellence in Digital Storytelling & Youth Engagement',
    organization: 'Assam Digital Creators Summit',
    description: 'Recognized for achieving over 2.5 Million monthly organic impressions across Instagram and YouTube.',
    badgeType: 'Gold',
    counterValue: '2.5M+ Reach',
    category: 'Digital Reach'
  },
  {
    id: 'ach-3',
    year: '2024',
    title: 'Best Short Film & Cultural Documentary',
    organization: 'Guwahati International Film Festival - Student Category',
    description: 'Produced and directed "Voices of the Valley", documenting indigenous Assamese folk artists.',
    badgeType: 'Silver',
    counterValue: '1st Runner Up',
    category: 'Cinematography'
  },
  {
    id: 'ach-4',
    year: '2023',
    title: '100% Live Event Streaming Reliability Milestone',
    organization: 'Royal Global University Quality Directorate',
    description: 'Successfully broadcasted 45+ major university events live with zero downtime.',
    badgeType: 'Special',
    counterValue: '45+ Live Streams',
    category: 'Technical Milestone'
  }
];

export const timelineData: TimelineMilestone[] = [
  {
    id: 'tm-1',
    year: '2017',
    quarter: 'Q1',
    title: 'Foundation of RGU Media Cell',
    subtitle: 'From a small group of passionate student photographers to an official university unit.',
    description: 'Established under the aegis of The Assam Royal Global University to document campus life and institutional milestones.',
    highlights: ['First official photography crew', 'Coverage of inaugural Convocation', '5 core student members']
  },
  {
    id: 'tm-2',
    year: '2020',
    quarter: 'Q3',
    title: 'Digital First & Broadcast Expansion',
    subtitle: 'Transitioning to full HD live streaming and social video production.',
    description: 'Pioneered virtual convocation broadcasts and online academic webinars during global virtual periods.',
    highlights: ['Setup of 4K camera rigs', 'Launch of official YouTube Channel', 'Expansion to 8 specialized departments']
  },
  {
    id: 'tm-3',
    year: '2023',
    quarter: 'Q2',
    title: 'Launch of "Royal Talks" Studio & Podcast Wing',
    subtitle: 'Dedicated audio-visual podcasting studio setup.',
    description: 'Built a state-of-the-art studio equipped with Shure microphones, acoustic paneling, and multi-cam podcast switching.',
    highlights: ['Multi-mic soundstage', '1st season of Royal Talks', 'Over 50 guest episodes recorded']
  },
  {
    id: 'tm-4',
    year: '2025',
    quarter: 'Q1',
    title: 'National Media Conclave Recognition',
    subtitle: 'Voted #1 Student Media Team in Northeast India.',
    description: 'Surpassed 2.5M monthly organic social reach while expanding student training bootcamps for first-year entrants.',
    highlights: ['National Award Winners', 'Reel & Short-form team launch', '100+ active student contributors']
  },
  {
    id: 'tm-5',
    year: '2026',
    quarter: 'Current',
    title: 'Recruitment Drive 2026-27 & AI-Integrated Production',
    subtitle: 'Welcoming new creators and adopting next-gen production workflows.',
    description: 'Launching our new official digital portal with integrated application management, real-time portfolio analytics, and automated recruitment workflows.',
    highlights: ['Interactive Portal Launch', '10 specialized departments', 'PWA & 4K gallery archives']
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Prof. (Dr.) A. K. Sharma',
    role: 'Dean of Student Welfare & Academic Affairs',
    category: 'Faculty',
    quote: 'The Media Team is the beating heart of Royal Global University. Their professionalism, creativity, and tireless dedication to capturing our finest moments make us immensely proud.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    batchOrDept: 'Faculty Management'
  },
  {
    id: 'test-2',
    name: 'Ananya Hazarika',
    role: 'Alumna & Senior Video Producer at NDTV',
    category: 'Alumni',
    quote: 'My journey in the RGU Media Team gave me real-world broadcast exposure. The hands-on experience handling RED/Sony cameras and tight deadlines prepared me directly for national journalism.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    batchOrDept: 'Batch of 2023 (Mass Com)'
  },
  {
    id: 'test-3',
    name: 'Rohan Borgohain',
    role: 'President, RGU Student Union',
    category: 'Students',
    quote: 'Whenever an event happens at RGU, we know the Media Team will elevate it to cinematic standards. Their aftermovies and reels give our campus memories an unforgettable shine.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    batchOrDept: 'B.Tech CSE, Final Year'
  }
];

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who can apply to join the RGU Media Team?',
    answer: 'Any currently enrolled student at The Assam Royal Global University (across all undergraduate, postgraduate, and PhD programs) is eligible to apply. We welcome passionate storytellers from every academic discipline!',
    category: 'Eligibility'
  },
  {
    id: 'faq-2',
    question: 'Is prior photography or video editing experience required?',
    answer: 'No! While prior experience or a portfolio is a plus, passion, discipline, and willingness to learn are what matter most. We conduct regular hands-on workshops and mentorship sessions for beginners.',
    category: 'Requirements'
  },
  {
    id: 'faq-3',
    question: 'Will training and equipment be provided?',
    answer: 'Yes! Selected members receive hands-on training from senior heads and industry mentors. The university provides professional cameras, studio lighting, audio rigs, and high-performance editing workstations.',
    category: 'Training'
  },
  {
    id: 'faq-4',
    question: 'Can first-year students apply during the current recruitment drive?',
    answer: 'Absolutely! First-year students are strongly encouraged to apply. Joining in your first year allows you maximum time to build a strong portfolio, gain leadership experience, and grow within the team hierarchy.',
    category: 'First-Year Entrants'
  },
  {
    id: 'faq-5',
    question: 'How are selections made and what is the process?',
    answer: 'The selection process consists of two simple steps: 1) Submitting the official Google Form application with your details and any optional sample work, followed by 2) A casual interactive task/interview round with department heads.',
    category: 'Selection Process'
  }
];
