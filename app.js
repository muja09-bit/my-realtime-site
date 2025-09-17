// app.js (type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyB2vduLYT5w_SVMHo6KJ0CVJWWexICip_4",
  authDomain: "my-realtime-site.firebaseapp.com",
  projectId: "my-realtime-site",
  storageBucket: "my-realtime-site.appspot.com",
  messagingSenderId: "824570401818",
  appId: "1:824570401818:web:917f7ec3bc0067c971ada3"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* UI refs */
const messagesEl = document.getElementById('messages'); // boleh rename ikut lab/equipment
const form = document.getElementById('msgForm');       // form untuk tambah maintenance / notes
const input = document.getElementById('msgInput');

/* Reference ke koleksi messages (atau maintenance_logs) */
const messagesCol = collection(db, "messages"); // nanti boleh tukar ke: labs/{labId}/equipment/{eqId}/maintenance_logs

/* Listen real-time */
onSnapshot(messagesCol, (snapshot) => {
  messagesEl.innerHTML = ''; // clear list
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.className = 'msg';
    div.textContent = `${data.when} — ${data.text}`;
    messagesEl.appendChild(div);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
});

/* Submit form */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  await addDoc(messagesCol, {
    text,
    when: new Date().toLocaleTimeString()
  });

  input.value = '';
});

/* --- Contoh fungsi CRUD tambahan untuk Firestore --- */

// Tambah lab baru
async function addLab(labId, name, location) {
  await setDoc(doc(db, "labs", labId), { name, location });
}

// Tambah equipment
async function addEquipment(labId, eqId, name, quantity, status) {
  await setDoc(doc(db, "labs", labId, "equipment", eqId), {
    name,
    quantity,
    status,
    last_maintenance: new Date()
  });
}

// Tambah maintenance log
async function addMaintenanceLog(labId, eqId, staffId, notes) {
  const logRef = collection(db, "labs", labId, "equipment", eqId, "maintenance_logs");
  await addDoc(logRef, {
    date: new Date(),
    staff: staffId,
    notes
  });

  // update last maintenance
  const eqRef = doc(db, "labs", labId, "equipment", eqId);
  await updateDoc(eqRef, { last_maintenance: new Date() });
}

// Baca semua lab
async function getAllLabs() {
  const labsSnapshot = await getDocs(collection(db, "labs"));
  labsSnapshot.forEach(doc => console.log(doc.id, doc.data()));
}

// Update equipment status / quantity
async function updateEquipment(labId, eqId, status, quantity) {
  await updateDoc(doc(db, "labs", labId, "equipment", eqId), { status, quantity });
}

// Delete equipment
async function deleteEquipment(labId, eqId) {
  await deleteDoc(doc(db, "labs", labId, "equipment", eqId));
}

// Delete lab
async function deleteLab(labId) {
  await deleteDoc(doc(db, "labs", labId));
}






