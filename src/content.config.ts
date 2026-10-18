import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  /** Starlight owns /docs/. Content lives in src/content/docs/docs/. */
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

  blog: defineCollection({
    loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
    schema: ({ image }) => z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      /** Other posts' ids, rendered as "Related guides" under the post (test/blog-related.test.mjs). */
      related: z.array(z.string()).default([]),
      /** Social share image (og:image, twitter:image), 1200x630, a path under src/assets/. */
      image: image().optional(),
      /** What the social image shows (og:image:alt). Required wherever `image` is set. */
      imageAlt: z.string().optional(),
    }),
  }),
};
