firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com"
});

firebase.auth().signInAnonymously().catch(console.error);

// Optional: Google Sign-In for SaaS
