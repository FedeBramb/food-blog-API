import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import knex from 'knex';


// Controllers
import { handleSignin } from './controllers/signin.controller.js';
import { handleProfile } from './controllers/profile.controller.js';
import { handleRegister } from './controllers/register.controller.js';
import { handleAddComment } from './controllers/comment.controller.js';
import { handleCommentsRecipeId } from './controllers/comment.controller.js';
import { handleGetRecipes } from './controllers/recipes.controller.js';
import { handleGetRecipe } from './controllers/recipes.controller.js';
import { handleCommentDelete } from './controllers/comment.controller.js';


const db = knex({
  client: 'pg',
  connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      host: process.env.DATABASE_HOST,
      port: 5432,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PW,
      database: process.env.DATABASE_DB,
  },
});

const app = express();

// Configura CORS per permettere richieste dal frontend
app.use(cors({
  origin: 'https://food-blog-tlsm.onrender.com',
}));

app.use(bodyParser.json());

// 'SELECT 1' solo per constatare la connessione al DB
db.raw('SELECT 1')
  .then(() => console.log('Connesso al database'))
  .catch(err => console.error('Errore di connessione al database:', err));

app.get('/', (req, res) => { res.send('sta funzionando') })

// Log in utente
app.post('/signin', async (req, res) => { handleSignin(req, res, db, bcrypt) })

// Registrazione nuovo utente
app.post('/register', async (req, res) => { handleRegister(req, res, db, bcrypt) });

// Get profilo utente
app.get('/profile/:id', async (req, res) => { handleProfile(req, res, db) });

// Ottiene tutte le ricette
app.get('/recipes/', async (req, res) => { handleGetRecipes(req, res, db) });

// Ottiene ricetta per Id
app.get('/recipes/:id', async (req, res) => { handleGetRecipe(req, res, db) });

// Ottiene commenti per id ricetta
app.get('/recipes/:idricetta/comments', async (req, res) => { handleCommentsRecipeId(req, res, db) });

// Aggiunge nuovo commento
app.post('/recipes/:idricetta/comments', async (req, res) => { handleAddComment(req, res, db) });

// Cancella commento utente
app.delete('/recipes/:idricetta/comments/:comment_id', async (req, res) => { handleCommentDelete(req, res, db)});

const PORT = 5432;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

export { db };
