import fs from 'fs/promises'; // Utilizza la versione promessa dell'API fs
import path from 'path';
import { fileURLToPath } from 'url';

import { db } from './server.js';
// Configura Knex



// Ottieni il percorso del file corrente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funzione per importare una singola ricetta
const importRecipe = async (recipe) => {
  const {
    title, description, ingredients, instructions, prepTime, cookTime, totalTime, servings, difficulty, imageCarousel, imagesMiniature, video, imagesCookBook, imagesSquare
  } = recipe;

  try {
    await db('recipes').insert({
      title,
      description,
      ingredients: JSON.stringify(ingredients),
      instructions: JSON.stringify(instructions),
      prep_time: prepTime,
      cook_time: cookTime,
      total_time: totalTime,
      servings,
      difficulty,
      image_carousel: imageCarousel,
      images_miniature: imagesMiniature,
      video,
      images_cook_book: imagesCookBook,
      images_square: imagesSquare
    });
    console.log(`Ricetta "${title}" inserita con successo!`);
  } catch (err) {
    console.error('Errore durante l\'inserimento della ricetta:', err);
  }
};

// Leggi e importa tutte le ricette
const importRecipes = async () => {
  const recipesDir = path.join(__dirname, 'ricette'); // directory dei file delle ricette
  try {
    const recipeFiles = await fs.readdir(recipesDir);

    for (const file of recipeFiles) {
      const filePath = path.join(recipesDir, file);
      const module = await import(filePath.startsWith('file://') ? filePath : `file://${filePath}`);
      const recipe = module.default;
      await importRecipe(recipe);
    }
  } catch (err) {
    console.error('Errore durante la lettura delle ricette:', err);
  } finally {
    db.destroy(); // Chiude la connessione a Knex
  }
};

importRecipes();



