/**
 * Configuration file for The Assam Royal Global University Media Team Official Portal.
 * You can update the Google Form URL, recruitment status, deadlines, and announcement settings here.
 */

export interface AppConfig {
  universityName: string;
  universityShort: string;
  universityLocation: string;
  establishedYear: number;
  googleFormUrl: string;
  recruitment: {
    isOpen: boolean;
    academicYear: string;
    deadlineDate: string; // ISO format or human date
    targetDeadlineMs: number; // Timestamp for countdown timer
    announcementBanner: string;
    contactEmail: string;
    contactPhone: string;
    officeLocation: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    whatsapp: string;
  };
}

// Target deadline: August 30, 2026 23:59:59 IST
const deadlineTimestamp = new Date("2026-08-30T23:59:59+05:30").getTime();

export const config = {
  universityName: "The Assam Royal Global University",
  universityShort: "Royal Global University",
  universityLocation: "Betkuchi, Opp. Tirupati Balaji Temple, NH 37, Guwahati, Assam 781035",
  establishedYear: 2013,
  
  // Official Google Form URL for Media Team Recruitment
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdKNSBvbrFwR4yo-Zx5aVmn90mN-OtfSr5HVh86EbLMKmBUYw/viewform?usp=publish-editor",

  recruitment: {
    isOpen: true,
    academicYear: "2026-2027",
    deadlineDate: "August 30, 2026",
    targetDeadlineMs: deadlineTimestamp,
    announcementBanner: "🔥 Recruitment Drive 2026-27 is LIVE! Apply before August 30, 2026 to join the Official RGU Media Team.",
    contactPhone: "99575 06071",
    officeLocation: "Block A, Media & PR Cell, Royal Global University Campus, Guwahati",
    whatsappAssistGroup: "https://chat.whatsapp.com/L301ratApTM5DxJ9F7M5EE",
  },

  socialLinks: {
    instagram: "https://www.instagram.com/royalglobaluniversity/",
    facebook: "https://facebook.com/royalglobaluniversity",
    youtube: "https://youtube.com/@royalglobaluniversity",
    linkedin: "https://linkedin.com/school/royal-global-university",
    whatsapp: "https://chat.whatsapp.com/L301ratApTM5DxJ9F7M5EE",
  },
};
