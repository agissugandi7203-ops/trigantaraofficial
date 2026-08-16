export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.statusCode = 200;
  res.end(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      '',
      'Sitemap: https://trigantara.web.id/sitemap.xml',
      '',
    ].join('\n')
  );
}
