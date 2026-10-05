# elijahloving.com (static interim site)

A static copy of the WordPress site at elijahloving.com. It stays in place until the full redesign.

Pages: Home, About, Illustration Portfolio (/portfolio/), Graphic Design Portfolio (/graphicdesign_portfolio/), Student Portfolio (/student-portfolio/), and 404.html.

No build step is needed. Serve the folder as is. To preview it locally:

    python3 -m http.server 8080

Then open http://localhost:8080/.

The generator scripts (build_images.py and build_site.py) live outside this folder in /workspace/site/tools/. They read the WordPress backup and never modify it.

Old WordPress addresses (/patron/, /shop/, /tmq/ and a few more) are small redirect pages: each one sends visitors on with a meta refresh and has a canonical tag pointing at its new page. They are deliberately left out of sitemap.xml.

/blog/ is the archive of the old WordPress blog (136 posts from 2021 to 2024). Each post lives at its original address, /blog/YYYY/MM/DD/slug/, and its images are in images/blog/. The 14 very short live-stream notices are marked noindex and left out of sitemap.xml; every other post is listed there.
