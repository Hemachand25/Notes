import { useState, useEffect } from "react";
import {
  getNotes,
  createNote,
  deleteNote,
  updateNote,
} from "./services/noteService";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await getNotes();
      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to load notes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      if (editingId) {
        await updateNote(editingId, { title, content });
        setEditingId(null);
      } else {
        await createNote({ title, content });
      }
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      setError("Failed to save note.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      setError("Failed to delete note.");
      console.error(err);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        📒 <span>Notes App</span>
      </h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Add/Edit Form */}
      <form
        onSubmit={handleAddNote}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "8px",
            flex: 1,
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            padding: "8px",
            flex: 2,
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            background: editingId ? "orange" : "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Notes List */}
      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ margin: "0 0 5px 0" }}>{note.title}</h3>
              <p style={{ margin: "0 0 10px 0" }}>{note.content}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleEdit(note)}
                  style={{
                    background: "orange",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}

export default App;
