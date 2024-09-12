export const handleRegister = async (req, res, db, bcrypt) => {
    const { email, username, password } = req.body;
  
    try {
      // Verifica che email, username e password siano presenti
      if (!email || !username || !password) {
        return res.status(400).json({ error: 'Form incompleta' });
      }
  
      // Controlla se l'email o il username sono già in uso
      const existingUser = await db('users')
        .where({ email })
        .orWhere({ username }) // Check for both email and username
        .first();
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email o username già in uso' });
      }
  
      // Hash della password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Inserisci il nuovo utente nel database e restituisce l'utente creato
      const [newUser] = await db('users')
        .insert({
          email: email,
          username: username,
          password_hash: hashedPassword,
          joined: new Date(),
        })
        .returning(['id', 'email', 'username', 'joined']); // Fetch all relevant fields
  
      // Restituisce l'oggetto utente appena creato
      return res.status(201).json(newUser);
  
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Errore del server' });
      }
    }
  };
  