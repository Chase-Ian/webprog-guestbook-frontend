import { useEffect, useState } from 'react';
import axios from 'axios';

const API = "/guestbook";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [status, setStatus] = useState('');

  const fetchEntries = async () => {
    const res = await axios.get(API);
    setEntries(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting guestbook entry', form);
    setStatus('sending');
    try {
      const res = await axios.post(API, form);
      console.log('Post response', res.data);
      setForm({ name: '', message: '' });
      setStatus('sent');
      fetchEntries();
    } catch (error) {
      console.error('Error posting:', error);
      setStatus('error: ' + (error?.message || 'unknown'));
    }
  };

  const deleteEntry = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchEntries();
  };

  const editEntry = async (id) => {
    const newMessage = prompt("Update your message:");
    if (newMessage) {
      await axios.put(`${API}/${id}`, { message: newMessage });
      fetchEntries();
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>My Guestbook</h1>
      
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
        <button type="submit">Sign Guestbook</button>
      </form>
      {status && <div style={{ marginTop: '0.5rem' }}>Status: {status}</div>}

      <hr />

      {entries.map(entry => (
        <div key={entry.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
          <strong>{entry.name}</strong>: {entry.message}
          <br />
          <button onClick={() => editEntry(entry.id)}>Edit</button>
          <button onClick={() => deleteEntry(entry.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}