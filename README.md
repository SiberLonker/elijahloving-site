# elijahloving.com (static interim site)

A static copy of the WordPress site at elijahloving.com. It stays in place until the full redesign.

Pages: Home, About, Illustration Portfolio (/portfolio/), Graphic Design Portfolio (/graphicdesign_portfolio/), Student Portfolio (/student-portfolio/), and 404.html.

No build step is needed. Serve the folder as is. To preview it locally:

    python3 -m http.server 8080

Then open http://localhost:8080/.

The generator scripts (build_images.py and build_site.py) live outside this folder in /workspace/site/tools/. They read the WordPress backup and never modify it.

Old WordPress addresses (/patron/, /shop/, /tmq/, /collaboration/ and a few more) are small redirect pages: each one sends visitors on with a meta refresh and has a canonical tag pointing at its new page. They are deliberately left out of sitemap.xml.

Learn (/learn/) lists the old WordPress posts that teach drawing, illustration and design craft. All 136 old posts still live at their original addresses, /blog/YYYY/MM/DD/slug/, with images in images/blog/, so old links keep working. Only the Learn posts are indexed and listed in sitemap.xml; the rest are marked noindex and left out of the listing. /blog/ now forwards to /learn/. The list of Learn posts is the LEARN set in the build script (/workspace/site/blog-work/build_blog.py on the build box).

/creative_content_subscription/ is the monthly design plans page (Square checkout links for CCS Standard and CCS Pro). /work-with-me/ has the client intake form. The form posts to Formspree once a form ID is set in data-formspree-id (and the form action) in work-with-me/index.html; until then, submitting opens the visitor's email app addressed to info@elijahloving.com (assets/js/intake.js).
