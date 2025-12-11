import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  // LOGICA DI ACCESSO
  storage: import.meta.env.DEV === true 
    ? { kind: 'local' } // In locale (npm run dev) usa i file
    : { 
        kind: 'github', 
        repo: 'nicolagalassi/elena-photo' // <--- ES: 'mariorossi/elena-photo'
      },
  
  collections: {
    portfolio: collection({
      label: 'Portfolio',
      slugField: 'title',
      path: 'src/content/portfolio/*',
      format: { data: 'json' }, // <--- CAMBIAMENTO CHIAVE: Usiamo JSON
      schema: {
        title: fields.slug({ name: { label: 'Titolo (URL)' } }),
        
        title_it: fields.text({ label: 'Titolo (Italiano)', validation: { length: { min: 1 } } }),
        title_en: fields.text({ label: 'Title (English)' }),

        coverImage: fields.image({
            label: 'Immagine di Copertina (Home)',
            directory: 'src/assets/portfolio',
            publicPath: '@/assets/portfolio/',
        }),
        gallery: fields.array(
          fields.image({
            label: 'Foto',
            directory: 'src/assets/portfolio',
            publicPath: '@/assets/portfolio/',
          }),
          { label: 'Galleria Immagini' }
        ),
        // NESSUN CAMPO CONTENT QUI
      },
    }),
  },

  singletons: {
    exhibitions: singleton({
      label: 'Mostre e Riconoscimenti',
      path: 'src/content/exhibitions/list',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            year: fields.text({ label: 'Anno' }),
            description: fields.text({ label: 'Descrizione Evento' }),
          }),
          { 
            label: 'Elenco Eventi',
            itemLabel: props => `${props.fields.year.value} - ${props.fields.description.value}` 
          }
        ),
      },
    }),
  },
});