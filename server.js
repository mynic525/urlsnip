const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory storage for URL mappings (old logic)
const urlMap = {};

// In-memory storage for users (new logic)
const users = [];



// Old URL Shortening Logic
app.post('/shorten', (req, res) => {
  const { longUrl, customAlias } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'Long URL is required' });
  }

  const shortUrl = customAlias || Math.random().toString(36).substring(7);
  urlMap[shortUrl] = longUrl;

  console.log('urlMap:', urlMap); // Add this line to debug

  res.json({ shortUrl: `http://localhost:${port}/${shortUrl}` });
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the URL Shortener!');
  });

app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;

  // Log the requested shortUrl
  console.log('Requested shortUrl:', shortUrl);

 // Log the current state of urlMap
 console.log('Current urlMap:', urlMap);

// Look up the long URL in urlMap
  const longUrl = urlMap[shortUrl];

  if (longUrl) {
     // Redirect to the long URL
     console.log('Redirecting to:', longUrl);
    res.redirect(longUrl);
  } else {
    // Return a 404 error if the short URL is not found
    console.log('Short URL not found:', shortUrl);
    res.status(404).json({ error: 'URL not found' });
  }
});



// New Sign-Up Logic
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const userExists = users.some(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  users.push({ username, email, password });
  res.json({ message: 'Sign up successful' });
});

// New Sign-In Logic
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Sign in successful' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Server error:', err);  
});