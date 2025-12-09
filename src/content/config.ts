// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  // ... (questo resta uguale)
  schema: ({ image }) => z.object({
      title: z.string(),
      title_it: z.string(),
      //description_it: z.string().optional(),
      title_en: z.string().optional(), 
      //description_en: z.string().optional(),
      coverImage: image().optional(),
      gallery: z.array(image()).optional(),
  }),
});

// MODIFICATO: Ora è una collezione di tipo 'data'
const exhibitions = defineCollection({
    type: 'data', // <--- Importante!
    schema: z.object({
        items: z.array(
            z.object({
                year: z.string(),
                description: z.string(),
            })
        )
    })
});

export const collections = { portfolio, exhibitions };