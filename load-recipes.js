import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server.js'; // Importa l'istanza di Knex

// Ottieni il percorso della directory corrente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recipesPath = path.join(__dirname, 'recipes');
// Funzione per caricare ricette
const loadRecipes = async () => {
    const files = fs.readdirSync(recipesPath);
    
    for (const file of files) {
        const filePath = path.join(recipesPath, file);
        const recipe = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Inserisci nel database
        await db('recipes').insert({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients.join(', '), // Converte array in stringa se necessario
            instructions: recipe.instructions.join(', '), // Converte array in stringa se necessario
            prep_time: recipe.prepTime,
            cook_time: recipe.cookTime,
            total_time: recipe.totalTime,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            image_carousel: recipe.imageCarousel,
            images_miniature: recipe.imagesMiniature,
            video: recipe.video,
            images_cook_book: recipe.imagesCookBook,
            images_square: recipe.imagesSquare,
        });
    }
};

loadRecipes().catch(error => {
    console.error('Errore durante il caricamento delle ricette:', error);
});

