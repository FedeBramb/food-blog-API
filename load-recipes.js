import { readdirSync } from 'fs';
import { join, extname } from 'path';
import knex from 'knex';

// Funzione per caricare ricette
const loadRecipes = async () => {
    const recipesDir = join(__dirname, './ricette'); // Sostituisci con il percorso corretto
    const files = readdirSync(recipesDir);
    
    for (const file of files) {
        if (extname(file) === '.js') {
            const recipePath = join(recipesDir, file);
            const recipe = require(recipePath);
            
            // Adatta i dati della ricetta ai nomi delle colonne del database
            const adaptedRecipe = {
                id: recipe.id,
                title: recipe.title,
                description: recipe.description,
                ingredients: recipe.ingredients.join(', '), // Modifica come necessario
                instructions: recipe.instructions.join(', '), // Modifica come necessario
                prep_time: recipe.prepTime,
                cook_time: recipe.cookTime,
                total_time: recipe.totalTime,
                servings: recipe.servings,
                difficulty: recipe.difficulty,
                image_carousel: recipe.imageCarousel,
                images_miniature: recipe.imagesMiniature,
                video: recipe.video,
                images_cook_book: recipe.imagesCookBook,
                images_square: recipe.imagesSquare
            };
            
            // Inserisci la ricetta nel database
            await knex('recipes').insert(adaptedRecipe);
        }
    }
    
    console.log('Ricette caricate nel database.');
};

loadRecipes().catch(err => {
    console.error('Errore durante il caricamento delle ricette:', err);
});
