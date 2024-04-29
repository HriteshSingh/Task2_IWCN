const express = require('express');
const mysql = require('mysql');
var cors = require('cors')

const app = express();
const port = 3001; // Choose any port you prefer

// Create a connection pool to handle multiple connections to the database
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hritesh'
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

// Route to handle adding a new note
app.post('/addNote', (req, res) => {
    const { note } = req.body;
    if (!note) {
        return res.status(400).json({ error: 'Note is required' });
    }

    // Insert the note into the database
    pool.query('INSERT INTO notes (note_text) VALUES (?)', [note], (err, results) => {
        if (err) {
            console.error('Error inserting note:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Note inserted successfully');
        res.status(200).send('Note added successfully');
    });
});

// Route to handle fetching all notes
app.get('/getNotes', (req, res) => {
    // Fetch all notes from the database
    pool.query('SELECT * FROM notes', (err, results) => {
        if (err) {
            console.error('Error fetching notes:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(results);
    });
});

// Route to handle deleting a note
app.delete('/deleteNote/:id', (req, res) => {
    const noteId = req.params.id;

    // Delete the note from the database
    pool.query('DELETE FROM notes WHERE id = ?', [noteId], (err, results) => {
        if (err) {
            console.error('Error deleting note:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Note deleted successfully');
        res.status(200).send('Note deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});