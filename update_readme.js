const fs = require('fs');
let readme = fs.readFileSync('README.md', 'utf8');

const latestUpdates = `
## ✨ Latest Updates

- **Animated Backgrounds:** Added looping background videos to the Media Team Works and Members Info pages for a cinematic feel.
- **Direct Recruitment Links:** Upgraded the application process with direct WhatsApp group invite links for specific departments (Reel, Mobile Photography, Content Design, etc.).
- **Dynamic Recruitment Banner:** Integrated a live, color-cycling animation for the "Application will be closing soon" recruitment banner.
- **Updated Contact Details:** Updated campus location to **C BLOCK - 4TH FLOOR** and added alternative helpline numbers.
`;

readme = readme.replace('## 🛠️ Tech Stack', latestUpdates + '\n## 🛠️ Tech Stack');

fs.writeFileSync('README.md', readme);
