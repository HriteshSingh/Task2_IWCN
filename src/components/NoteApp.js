import React,{useState,useEffect} from 'react'
import axios from 'axios';

function NoteApp() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
}, []); // Run this effect only once when the component mounts

const fetchNotes = () => {
  axios.get('http://localhost:3001/getNotes')
      .then(response => {
          setNotes(response.data);
          setIsLoading(false); 
      })
      .catch(error => {
          console.error('Error fetching notes:', error);
          setIsLoading(false);
      });
};

  const handleAddNote = () => {
    axios.post('http://localhost:3001/addNote', { note })
        .then(response => {
            console.log(response.data);
            setNote(''); // Clear input after adding note
            fetchNotes(); // Fetch updated list of notes
            // Optionally, you can update the UI or show a message indicating success
        })
        .catch(error => {
            console.error('Error adding note:', error);
            // Handle error or show error message to the user
        });  
    window.location.reload();
  };

  
  const handleDeleteNote = (id) => {
    axios.delete(`http://localhost:3001/deleteNote/${id}`)
        .then(response => {
            console.log(response.data);
            fetchNotes(); // Fetch updated list of notes after deletion
        })
        .catch(error => {
            console.error('Error deleting note:', error);
        });
};
  return (
    <div>
      <div className='Navbar-container'>
        <img src={require('./humbuger.png')} alt="" width={30}/>
        <p className='navbar-head'>Notes</p>
      </div>
      <div className='Notes-body'>
        <div className='note-data'>
            <input type="text" placeholder='Take a note....' value={note} onChange={(e) => setNote(e.target.value)} />
            <button onClick={handleAddNote}>Add Note</button>
        </div>
        <div className="notes-fetch-data">
        {isLoading ? (
                            <p className='para-style'>Loading...</p> // Display loading message if data is still loading
                        ) : notes.length === 0 ? (
                            <p className='para-style'>No Notes to display!! Please Add your notes...</p> // Display "No Notes to display" message if there are no notes
                        ) : (
            <div className='note-flex'>
            {notes.map(note => (
            <div key={note.id} className="note-container">
                <p><b>{note.note_text}</b></p>
                <div className='note-timestamp'>
                    <p>{note.created_at}</p>
                </div>
                <div className='note-delete'>
                    <img src={require('./bin.png')} alt="" width={25} onClick={() => handleDeleteNote(note.id)}/>
                </div>
            </div>
              ))}
            </div>
                        )}
        </div>
      </div>
      <div className='Footer-container'>
        <p>Copyright &copy; 2022</p>
      </div>
    </div>
  )
}

export default NoteApp
