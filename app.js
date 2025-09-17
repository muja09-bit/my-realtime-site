// app.js (type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

/*
  Replace the object below (firebaseConfig) with the config you get
  from the Firebase console after you add a Web app to your Firebase project.
  Make sure it includes the databaseURL.
*/
const firebaseConfig = {
  apiKey: "AIzaSyB2vduLYT5w_SVMHo6KJ0CVJWWexICip_4",
  authDomain: "my-realtime-site.firebaseapp.com",
  databaseURL: "https://my-realtime-site-default-rtdb.asia-southeast1.firebasedatabase.app "
  projectId: "my-realtime-site",
  storageBucket: "my-realtime-site.firebasestorage.app",
  messagingSenderId: "824570401818",
  appId: "1:824570401818:web:917f7ec3bc0067c971ada3"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);
const messagesRef = ref(db, 'messages'); // location in DB we'll use

// UI refs
const messagesEl = document.getElementById('messages');
const form = document.getElementById('msgForm');
const input = document.getElementById('msgInput');

// When a child is added under /messages, show it.
// Note: onChildAdded will fire once per existing child on initial load,
// then again for each new child added (so you see history + new items).
onChildAdded(messagesRef, (snap) => {
  const data = snap.val();
  const div = document.createElement('div');
  div.className = 'msg';
  div.textContent = `${data.when} — ${data.text}`;
  messagesEl.appendChild(div);
  // optional: keep newest visible
  messagesEl.scrollTop = messagesEl.scrollHeight;
});

// Send message (push creates a unique key)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  push(messagesRef, {
    text,
    when: new Date().toLocaleTimeString()
  });
  input.value = '';
});




