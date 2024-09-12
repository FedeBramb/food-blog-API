export const handleSignin = async (req, res, db, bcrypt) => {
    const { email, password } = req.body;

    try {
        // Trova l'utente nel DB usando Knex
        const user = await db('users').where({ email }).first();
        if (!user) {
            return res.status(401).json({ error: 'Utente non trovato' }); // Aggiunto il return
        }

        // Confronta la password hashata
        const isMatch = await bcrypt.compare(password, user.password_hash);
        // Restituisce l'utente o psw errata
        return isMatch 
            ? res.json(user) 
            : res.status(400).json({ error: 'Errore di accesso: password errata' });   
    } catch (error) {
        console.error('Errore durante il login:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
};
