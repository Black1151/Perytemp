// scripts/extractRoutes.cjs
// CommonJS script to enumerate Next.js App Router paths
// and output to routes.json in project root (synchronous version)

const { sync: globSync } = require('glob');
const fs = require('fs');

function extractRoutes() {
  console.log("starting...");
  try {
    // 1. Find all page.tsx files under src/app synchronously
    const files = globSync('src/app/**/page.tsx');

    // 2. Map each file path to a URL route
    const routes = files.map((file) => {
      // a) Strip off the src/app prefix
      let route = file.replace(/^src[\\/]app/, '');

      // b) Remove the /page.tsx suffix
      route = route.replace(/[\\/]page\.tsx$/, '');

      // c) Remove Next.js route-group folders: e.g. /(group)
      route = route.replace(/[\\/]\([^\\/]+\)/g, '');

      // d) Normalize empty or /index to '/'
      if (route === '' || route === '/index') return '/';

      // e) Convert dynamic segments:
      //    [id]      -> :id
      //    [...slugs] -> :slugs/*
      route = route.replace(/\[(\.\.\.)?(\w+)\]/g, (_, dots, name) =>
        dots ? `:${name}/*` : `:${name}`
      );

      return route;
    });

    // 3. Sort and dedupe the list
    const uniqueRoutes = Array.from(new Set(routes)).sort();

    console.log("routes:", JSON.stringify(uniqueRoutes, null, 2));
    return uniqueRoutes;
  } catch (err) {
    console.error('Error extracting routes:', err);
    process.exit(1);
  }
}

// If run directly, extract and write to routes.json
if (require.main === module) {
  const uniqueRoutes = extractRoutes();
  const outPath = 'routes.json';
  fs.writeFileSync(outPath, JSON.stringify(uniqueRoutes, null, 2));
  console.log(`Extracted ${uniqueRoutes.length} routes → ${outPath}`);
}

module.exports = extractRoutes;