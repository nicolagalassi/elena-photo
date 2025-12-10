import fs from 'node:fs';
import path from 'node:path';

const ASSETS_DIR = path.join('src', 'assets', 'portfolio');
const CONTENT_DIR = path.join('src', 'content', 'portfolio');

if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

console.log(`📂 Scansione cartella: ${ASSETS_DIR}`);

try {
    const items = fs.readdirSync(ASSETS_DIR, { withFileTypes: true });

    items.forEach(item => {
        if (item.isDirectory()) {
            const gallerySlug = item.name; 
            const projectRootPath = path.join(ASSETS_DIR, gallerySlug);
            const gallerySubFolderPath = path.join(projectRootPath, 'gallery');

            console.log(`\n🔎 Analisi progetto: ${gallerySlug}`);

            // 1. CERCA COVER
            let rootFiles = [];
            try { rootFiles = fs.readdirSync(projectRootPath); } catch (e) {}
            const coverFile = rootFiles.find(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
            
            let coverImage = "";
            if (coverFile) {
                coverImage = `@/assets/portfolio/${gallerySlug}/${coverFile}`; // Niente virgolette extra qui, è un oggetto JS
            }

            // 2. CERCA GALLERIA
            let gallery = [];
            if (fs.existsSync(gallerySubFolderPath)) {
                gallery = fs.readdirSync(gallerySubFolderPath)
                    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
                    .map(img => `@/assets/portfolio/${gallerySlug}/gallery/${img}`);
            }

            if (!coverImage && gallery.length === 0) return;

            // 3. CREA OGGETTO DATI
            const data = {
                title: gallerySlug, // Serve a Keystatic come slugField
                title_it: capitalize(gallerySlug),
                title_en: capitalize(gallerySlug),
                coverImage: coverImage,
                gallery: gallery
            };

            // 4. SCRIVI FILE JSON
            const contentFilePath = path.join(CONTENT_DIR, `${gallerySlug}.json`);
            fs.writeFileSync(contentFilePath, JSON.stringify(data, null, 2)); // null, 2 serve per formattare bello leggibile
            console.log(`   💾 File JSON creato: ${contentFilePath}`);
        }
    });

} catch (err) {
    console.error("Errore critico:", err);
}

function capitalize(s) {
    if (!s) return '';
    return s.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}