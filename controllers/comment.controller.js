export const handleAddComment = async (req, res, db) => {
    const { recipe_id } = req.params; // ID della ricetta
    const { id, user_id, user_name, comment_text, rating, create_at } = req.body;

    try {
        const result = await db('comments')
            .insert({
                id_comment: id,
                recipe_id: recipe_id,
                user_name: user_name,
                user_id: user_id,
                comment_text: comment_text,
                rating: rating,
                create_at: create_at,
            })
            .returning('*')

        // Recupera tutti i commenti della ricetta
        // 
        const commentsResult = await db('comments')
            .select('*')
            .where({ recipe_id: recipe_id })
        // Restituiamo i commenti e il nuovo commento
        res.json(commentsResult);

    } catch (error) {
        console.error('Errore durante l\'aggiunta del commento:', error);
        res.status(500).json('Errore del server');
    }
};

export const handleAllComments = async (req, res, db) => {
    try {
        const comments = await db('comments').select('*');
        res.json(comments);
    } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei commenti' });
    }
}


export const handleCommentsRecipeId = async (req, res, db) => {
    const { recipe_id } = req.params;
    try {
        const result = await db('comments')
            .select('*')
            .where({ recipe_id: recipe_id })
        // Anche se l'array dei commenti è vuoto non restituiamo un errore
        res.json(result)
          
    } catch (err) {
        console.error('Errore durante il recupero dei commenti:', err);
        res.status(500).json({ message: 'Errore del server' });
    }
}

export const handleCommentDelete = async (req, res, db) => {
    const { recipe_id, id_comment } = req.params; // id della ricetta
    const { user_id } = req.body; // id dell'utente

    try {
        // Esegui la cancellazione
        const result = await db('comments')
            .where({ recipe_id: recipe_id, user_id: user_id, id_comment: id_comment })
            .del();

        // Controlla se è stato cancellato almeno un commento
        if (result) {
            // Richiama l'handler per recuperare i commenti aggiornati
            await handleCommentsRecipeId({ params: { recipe_id } }, res, db);
        } else {
            return res.status(404).json({ message: 'Nessun commento trovato per cancellare.' });
        }
    } catch (error) {
        console.error('Errore durante la cancellazione del commento:', error);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
};