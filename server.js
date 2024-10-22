const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});
const db = admin.firestore();

const generateId = () => crypto.randomBytes(5).toString('hex');
const generateEditKey = () => crypto.randomBytes(10).toString('hex');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/search-results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search-results.html'));
});

app.post('/api/makeyourhtml', async (req, res) => {
  const { html } = req.body;
  if (!html) return res.status(400).send({ error: 'HTML content is required' });

  const id = generateId();
  const editKey = generateEditKey();

  await db.collection('htmls').doc(id).set({ html, editKey });
  res.send({ 
    link: `hostyourhtml.vercel.app/html/${id}`, 
    editKey 
  });
});

app.put('/api/edityourhtml', async (req, res) => {
  const { id, editKey, html } = req.body;
  if (!id || !editKey || !html) return res.status(400).send({ error: 'ID, edit key, and new HTML are required' });

  const doc = await db.collection('htmls').doc(id).get();
  if (!doc.exists) return res.status(404).send({ error: 'HTML not found' });

  if (doc.data().editKey !== editKey) return res.status(403).send({ error: 'Invalid edit key' });

  await db.collection('htmls').doc(id).update({ html });
  res.send({ success: true, message: 'HTML updated successfully' });
});

app.delete('/api/deleteyourhtml', async (req, res) => {
  const { id, editKey } = req.body;
  if (!id || !editKey) return res.status(400).send({ error: 'ID and edit key are required' });

  const doc = await db.collection('htmls').doc(id).get();
  if (!doc.exists) return res.status(404).send({ error: 'HTML not found' });

  if (doc.data().editKey !== editKey) return res.status(403).send({ error: 'Invalid edit key' });

  await db.collection('htmls').doc(id).delete();
  res.send({ success: true, message: 'HTML deleted successfully' });
});

app.get('/api/searchthehtmls', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).send({ error: 'Search query is required' });

  const snapshot = await db.collection('htmls').get();
  const results = snapshot.docs
    .filter(doc => doc.data().html.includes(query))
    .map(doc => ({ id: doc.id, html: doc.data().html }));

  res.render('search-results', { query, results });
});

app.get('/html/:id', async (req, res) => {
  const { id } = req.params;
  const doc = await db.collection('htmls').doc(id).get();

  if (!doc.exists) return res.status(404).send('HTML not found');

  res.send(doc.data().html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
