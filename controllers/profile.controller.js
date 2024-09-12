// Cerca il profilo utente in base all'id

export const handleProfile = async (req, res, db) => {
    const { id } = req.params;
    try {
        const profile = await db('users').where({ id }).first();
        !profile && res.status(401).json({error: 'Utente non trovato'})
    } catch (error) {
        console.error('Errore recupero id utente:', error);
        res.status(500).json({ error: 'Errore del server' });
    }   
}