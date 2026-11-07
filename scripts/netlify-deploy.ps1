# One-time Netlify setup + production deploy for the RGU Media Team site.
# Run from the project root in a terminal where `npx netlify-cli login` has been done.
$ErrorActionPreference = 'Stop'
$cli = 'netlify-cli@27.16.2'

if (-not (Test-Path '.netlify/state.json')) {
  npx --yes $cli sites:create --name rgu-media-team-1
}

# public Supabase values (same as .env.local) for Netlify builds
npx --yes $cli env:set VITE_SUPABASE_URL 'https://shfniokjtnkzyaupedre.supabase.co'
npx --yes $cli env:set VITE_SUPABASE_ANON_KEY 'sb_publishable__Al6LKw-xZiW8tr17Om2Bw_Gc5yicm2'

npm run build
npx --yes $cli deploy --prod --dir dist --message 'RGU Media Team site'
Write-Host 'NETLIFY-DEPLOY-DONE'
