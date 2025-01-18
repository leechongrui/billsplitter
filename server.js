// Registration endpoint with validation
app.post('/register', async (req, res) => {
    const { fullname, username, age, email, contact, password } = req.body;
  
    // Validate inputs
    if (!fullname) return res.status(400).json({ message: 'Full name is required.', field: 'fullname' });
    if (!username) return res.status(400).json({ message: 'Username is required.', field: 'username' });
    if (!age || age <= 0) return res.status(400).json({ message: 'Age must be greater than 0.', field: 'age' });
    if (!email || !email.includes('@')) return res.status(400).json({ message: 'Valid email is required.', field: 'email' });
    if (!contact) return res.status(400).json({ message: 'Contact number is required.', field: 'contact' });
    if (!password) return res.status(400).json({ message: 'Password is required.', field: 'password' });
  
    // Check for existing user
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (row) {
        return res.status(400).json({ message: 'Username already exists.', field: 'username' });
      }
  
      // Hash the password and store user
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.run(
        `INSERT INTO users (fullname, username, age, email, contact, password) VALUES (?, ?, ?, ?, ?, ?)`,
        [fullname, username, age, email, contact, hashedPassword],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error saving user. Try again later.' });
          }
          res.status(200).json({ message: 'Registration successful!' });
        }
      );
    });
  });
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Query the database for the user
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (!row || !bcrypt.compareSync(password, row.password)) {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
      }
  
      res.json({ success: true, message: 'Login successful!' });
    });
  });
    