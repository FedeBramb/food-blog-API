export const handleGetRecipes = async (req, res, db) => {
    try {
        const result = await db('recipes')
            .select('*')
        result.length > 0 ? res.json(result) : res.status(404).json('Nessuna ricetta trovata')
    } catch (error) {
        console.error('Errore durante il recupero delle ricette:', error);
        res.status(500).json('Errore del server');
    }
}

export const handleGetRecipe = async (req, res, db) => {
    const { recipe_id } = req.params;
    try {
        const result = await db('recipes')
            .where({ id: recipe_id })
            .first()
        
        result ? res.json(result) : res.status(404).json('Ricetta non trovata');
    } catch (error) {
        console.error('Errore durante il recupero della ricetta:', error);
        res.status(500).json('Errore del server');
    }
}
