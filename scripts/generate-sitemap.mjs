import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.log('Supabase environment variables not found, generating static sitemap');
  generateStaticSitemap();
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function generateStaticSitemap() {
  const baseUrl = 'https://dosasset.com';

  // Static URLs
  const staticUrls = [
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/projects`, changefreq: 'weekly', priority: '0.9', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/projects/upcoming`, changefreq: 'weekly', priority: '0.7', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/projects/ongoing`, changefreq: 'weekly', priority: '0.7', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/projects/completed`, changefreq: 'weekly', priority: '0.7', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/about/story`, changefreq: 'monthly', priority: '0.6', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/about/management`, changefreq: 'monthly', priority: '0.6', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.6', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: '0.8', lastmod: new Date().toISOString().split('T')[0] },
  ];

  // Generate XML
  const urlset = staticUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod}</lastmod>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

  // Write to public/sitemap.xml
  writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap.trim());
  console.log('Static sitemap generated successfully');
}
  const baseUrl = 'https://dosasset.com';

  // Static URLs
  const staticUrls = [
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/projects`, changefreq: 'weekly', priority: '0.9', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/projects/upcoming`, changefreq: 'weekly', priority: '0.7', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/projects/ongoing`, changefreq: 'weekly', priority: '0.7', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/projects/completed`, changefreq: 'weekly', priority: '0.7', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/about/story`, changefreq: 'monthly', priority: '0.6', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/about/management`, changefreq: 'monthly', priority: '0.6', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.6', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: '0.8', lastmod: new Date().toISOString().split('T')[0] },
  ];

  // Fetch projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('slug, updated_at');

  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
  } else {
    projects.forEach(project => {
      staticUrls.push({
        loc: `${baseUrl}/projects/${project.slug}`,
        changefreq: 'monthly',
        priority: '0.8',
        lastmod: new Date(project.updated_at).toISOString().split('T')[0]
      });
    });
  }

  // Fetch blog posts
  const { data: blogs, error: blogsError } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, published_at')
    .eq('is_published', true);

  if (blogsError) {
    console.error('Error fetching blogs:', blogsError);
  } else {
    blogs.forEach(blog => {
      staticUrls.push({
        loc: `${baseUrl}/blog/${blog.slug}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: new Date(blog.updated_at || blog.published_at).toISOString().split('T')[0]
      });
    });
  }

  // Generate XML
  const urlset = staticUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod}</lastmod>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

  // Write to public/sitemap.xml
  writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap.trim());
  console.log('Sitemap generated successfully');


generateSitemap().catch(console.error);