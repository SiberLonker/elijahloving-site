# elijahloving.com (static interim site)

A static copy of the WordPress site at elijahloving.com. It stays in place until the full redesign.

Pages: Home, About, Illustration Portfolio (/portfolio/), Graphic Design Portfolio (/graphicdesign_portfolio/), Student Portfolio (/student-portfolio/), and 404.html.

No build step is needed. Serve the folder as is. To preview it locally:

    python3 -m http.server 8080

Then open http://localhost:8080/.

The generator scripts (build_images.py and build_site.py) live outside this folder in /workspace/site/tools/. They read the WordPress backup and never modify it.

Old WordPress addresses (/patron/, /shop/, /tmq/ and a few more) are small redirect pages: each one sends visitors on with a meta refresh and has a canonical tag pointing at its new page. They are deliberately left out of sitemap.xml.

Learn (/learn/) lists the old WordPress posts that teach drawing, illustration and design craft, plus the TMQ interviews, the VoyageKC interview and The Last Colony process posts. All 136 old posts still live at their original addresses, /blog/YYYY/MM/DD/slug/, with images in images/blog/, so old links keep working. Only the Learn posts are indexed and listed in sitemap.xml; the rest are marked noindex. /blog/ itself forwards to /learn/ (a 301 in _redirects on Netlify, plus a meta refresh page for other hosts).

The site is hosted on Netlify (project elijahloving). _redirects is read by Netlify only.
