import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  type: 'data', // <--- CAMBIAMENTO CHIAVE: Ora è 'data'
  schema: ({ image }) => z.object({
    title: z.string().optional(), // In JSON il titolo a volte è l'ID, ma lasciamolo opzionale per sicurezza
    
    title_it: z.string(),
    title_en: z.string().optional(), 
    
    coverImage: image().optional(),
    gallery: z.array(image()).optional(),
  }),
});

const exhibitions = defineCollection({
    type: 'data', 
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