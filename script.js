// DOM Elements
const signupBtn = document.getElementById('signup-btn');
const signinBtn = document.getElementById('signin-btn');
const signupModal = document.getElementById('signup-modal');
const signinModal = document.getElementById('signin-modal');
const closeBtns = document.querySelectorAll('.close');
const shortenBtn = document.getElementById('shorten-btn');
const longUrlInput = document.getElementById('long-url');
const customAliasInput = document.getElementById('custom-alias');
const shortUrlResult = document.getElementById('short-url-result');
const historyList = document.getElementById('history-list');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

// Open Modals
signupBtn.addEventListener('click', () => {
  signupModal.style.display = 'block';
});

signinBtn.addEventListener('click', () => {
  signinModal.style.display = 'block';
});

// Close Modals
closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    signupModal.style.display = 'none';
    signinModal.style.display = 'none';
  });
});

// Sign Up
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = signupForm.querySelector('input[type="text"]').value;
  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Sign up successful! Please sign in.');
      signupModal.style.display = 'none';
    } else {
      alert(data.error || 'Sign up failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});

const response = await fetch(`${backendUrl}/shorten`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'https://urlsnip.onrender.com/', // Include the API key
  },
  body: JSON.stringify({ longUrl, customAlias }),
});

// Sign In
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = signinForm.querySelector('input[type="email"]').value;
  const password = signinForm.querySelector('input[type="password"]').value;

  try {
    const response = await fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Sign in successful!');
      signinModal.style.display = 'none';
      // You can store the user token or session here for future requests
    } else {
      alert(data.error || 'Sign in failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});

// Shorten URL
shortenBtn.addEventListener('click', async () => {
  const longUrl = longUrlInput.value;
  const customAlias = customAliasInput.value;

  if (longUrl) {
    try {
      // Send request to backend
      const response = await fetch('http://localhost:3000/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl, customAlias }),
      });

      const data = await response.json();

      if (response.ok) {
        // Display short URL
        shortUrlResult.innerHTML = `Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;

        // Add to history
        const historyItem = document.createElement('li');
        historyItem.textContent = `${longUrl} → ${data.shortUrl}`;
        historyList.appendChild(historyItem);

        // Clear inputs
        longUrlInput.value = '';
        customAliasInput.value = '';
      } else {
        alert(data.error || 'Failed to shorten URL');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  } else {
    alert('Please enter a valid URL');
  }
});
