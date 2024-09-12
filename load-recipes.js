import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server.js'; // Importa l'istanza di Knex

// Ottieni il percorso della directory corrente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funzione per caricare ricette
const loadRecipes = async () => {
    const recipesDir = path.join(__dirname, 'recipes'); // Costruisce il percorso alla cartella 'recipes' nella stessa directory
    const files = fs.readdirSync(recipesDir);
    
    for (const file of files) {
        if (path.extname(file) === '.js') {
            const recipePath = path.join(recipesDir, file);
            const recipe = await import(recipePath);
            
            // Adatta i dati della ricetta ai nomi delle colonne del database
            const adaptedRecipe = {
                id: recipe.default.id,
                title: recipe.default.title,
                description: recipe.default.description,
                ingredients: recipe.default.ingredients.join(', '), // Modifica come necessario
                instructions: recipe.default.instructions.join(', '), // Modifica come necessario
                prep_time: recipe.default.prepTime,
                cook_time: recipe.default.cookTime,
                total_time: recipe.default.totalTime,
                servings: recipe.default.servings,
                difficulty: recipe.default.difficulty,
                image_carousel: recipe.default.imageCarousel,
                images_miniature: recipe.default.imagesMiniature,
                video: recipe.default.video,
                images_cook_book: recipe.default.imagesCookBook,
                images_square: recipe.default.imagesSquare
            };
            
            // Inserisci la ricetta nel database
            await db('recipes').insert(adaptedRecipe);
        }
    }
    
    console.log('Ricette caricate nel database.');
};

loadRecipes().catch(err => {
    console.error('Errore durante il caricamento delle ricette:', err);
});
