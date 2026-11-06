// Prints the VITE_ADMIN_HASH value for an admin email + password.
// Usage: npm run admin:hash -- you@example.com "your password"
import { createHash } from 'node:crypto';

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: npm run admin:hash -- <email> <password>');
  process.exit(1);
}
const hash = createHash('sha256').update(`${email.trim().toLowerCase()}:${password}`).digest('hex');
console.log(`\nAdd this line to .env.local (and to your host's build environment):\n\nVITE_ADMIN_HASH=${hash}\n`);
