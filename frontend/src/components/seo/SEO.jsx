import { Helmet } from "react-helmet-async";
import { DEFAULT_SEO } from "./seoConfig";

function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = DEFAULT_SEO.ogType,
  noindex = false,
  structuredData,
}) {
  const finalTitle = title || DEFAULT_SEO.title;
  const finalDescription = description || DEFAULT_SEO.description;
  const finalKeywords = keywords || DEFAULT_SEO.keywords;
  const finalCanonical = canonicalUrl || DEFAULT_SEO.canonicalUrl;
  const finalOgImage = ogImage || DEFAULT_SEO.ogImage;
  const robotsContent = noindex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content={DEFAULT_SEO.siteName} />
      <link rel="canonical" href={finalCanonical} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={`${DEFAULT_SEO.siteName} - workflow automation and AI agents`}
      />
      <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
      <meta property="og:locale" content={DEFAULT_SEO.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta
        name="twitter:image:alt"
        content={`${DEFAULT_SEO.siteName} - workflow automation and AI agents`}
      />

      {structuredData ? (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      ) : null}
    </Helmet>
  );
}

export default SEO;
