import fs from 'node:fs';
import path from 'node:path';

// CONFIGURAZIONE
// Assicurati che i percorsi siano corretti rispetto a dove lanci lo script
const ASSETS_DIR = path.join('src', 'assets', 'portfolio');
const CONTENT_DIR = path.join('src', 'content', 'portfolio');

// Creiamo la cartella di destinazione se non esiste
if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

console.log(`📂 Scansione cartella: ${ASSETS_DIR}`);

try {
    const items = fs.readdirSync(ASSETS_DIR, { withFileTypes: true });

    items.forEach(item => {
        // Se è una cartella, la trattiamo come un progetto
        if (item.isDirectory()) {
            const gallerySlug = item.name; // es. "natura"
            const projectRootPath = path.join(ASSETS_DIR, gallerySlug);
            const gallerySubFolderPath = path.join(projectRootPath, 'gallery');

            console.log(`\n🔎 Analisi progetto: ${gallerySlug}`);

            // 1. CERCA LA COVER (nella root della cartella del progetto)
            const rootFiles = fs.readdirSync(projectRootPath);
            const coverFile = rootFiles.find(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

            let coverImageString = '';
            if (coverFile) {
                // Notare l'uso di posix.join per forzare gli slash in avanti anche su Windows per gli import di Astro
                // Astro vuole "@/assets/..." non "@\assets\..."
                coverImageString = `"@/assets/portfolio/${gallerySlug}/${coverFile}"`;
                console.log(`   ✅ Cover trovata: ${coverFile}`);
            } else {
                console.log(`   ⚠️  Nessuna cover trovata in ${projectRootPath}`);
            }

            // 2. CERCA LE IMMAGINI DELLA GALLERIA (nella sottocartella /gallery)
            let galleryListString = '';
            
            if (fs.existsSync(gallerySubFolderPath)) {
                const galleryImages = fs.readdirSync(gallerySubFolderPath)
                    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
                
                if (galleryImages.length > 0) {
                    console.log(`   ✅ Trovate ${galleryImages.length} immagini in /gallery`);
                    
                    // Crea la lista formattata per il file .mdoc
                    galleryListString = galleryImages
                        .map(img => `  - "@/assets/portfolio/${gallerySlug}/gallery/${img}"`)
                        .join('\n');
                } else {
                    console.log(`   ⚠️  La cartella /gallery è vuota.`);
                }
            } else {
                console.log(`   ⚠️  Sottocartella /gallery non trovata.`);
            }

            // Se non abbiamo né cover né immagini, saltiamo
            if (!coverFile && !galleryListString) {
                console.log(`   ❌ Saltato: cartella vuota o senza immagini valide.`);
                return;
            }

            // 3. GENERAZIONE CONTENUTO FILE
            const fileContent = `---
title: "${gallerySlug}"
title_it: "${capitalize(gallerySlug)}"
description_it: "Galleria: ${gallerySlug}"
title_en: "${capitalize(gallerySlug)}"
description_en: "Gallery: ${gallerySlug}"
coverImage: ${coverImageString}
gallery:
${galleryListString}
---
Generato automaticamente.`;

            // Scriviamo il file .mdoc
            const contentFilePath = path.join(CONTENT_DIR, `${gallerySlug}.mdoc`);
            
            // Sovrascrivi il file
            fs.writeFileSync(contentFilePath, fileContent);
            console.log(`   💾 File creato: ${contentFilePath}`);
        }
    });

} catch (err) {
    console.error("Errore durante la lettura delle cartelle:", err);
    console.log("Assicurati di aver creato la cartella src/assets/portfolio e che contenga le sottocartelle.");
}

// Funzione helper per mettere la Maiuscola
function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
}