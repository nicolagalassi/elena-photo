// keystatic.config.ts
import { config, fields, collection, singleton } from '@keystatic/core'; // <--- Aggiungi 'singleton' qui

export default config({
  storage: { kind: 'local' },
  
  // 1. Le Collezioni (rimuovi exhibitions da qui!)
  collections: {
    portfolio: collection({
       // ... lascia tutto il codice del portfolio uguale a prima ...
       label: 'Portfolio',
       slugField: 'title',
       path: 'src/content/portfolio/*',
       format: { contentField: 'content' },
       schema: {
          // ... i tuoi campi del portfolio ...
          title: fields.slug({ name: { label: 'Titolo' } }),
          title_it: fields.text({ label: 'Titolo (IT)' }),
          //description_it: fields.text({ label: 'Descrizione (IT)' }),
          title_en: fields.text({ label: 'Titolo (EN)' }),
          //description_en: fields.text({ label: 'Descrizione (EN)' }),
          coverImage: fields.image({ label: 'Cover', directory: 'src/assets/portfolio', publicPath: '@/assets/portfolio/' }),
          gallery: fields.array(fields.image({ label: 'Foto', directory: 'src/assets/portfolio', publicPath: '@/assets/portfolio/' }), { label: 'Galleria' }),
          //content: fields.document({ label: 'Testo', formatting: true, dividers: true, links: true }),
       }
    }),
  },

  // 2. I Singleton (AGGIUNGI QUESTO)
  singletons: {
    exhibitions: singleton({
      label: 'Lista Mostre e Riconoscimenti',
      path: 'src/content/exhibitions/list', // Salverà tutto in un file list.json (o yaml)
      format: { data: 'json' }, // Usiamo JSON che è comodo
      schema: {
        // Creiamo una lista (array) di oggetti
        items: fields.array(
          fields.object({
            year: fields.text({ label: 'Anno' }),
            description: fields.text({ label: 'Descrizione Evento' }),
          }),
          { 
            label: 'Elenco Eventi',
            // Questo serve per vedere un'anteprima carina nella lista dell'admin
            itemLabel: props => `${props.fields.year.value} - ${props.fields.description.value}` 
          }
        ),
      },
    }),
  },
});