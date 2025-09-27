import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function Create() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const authorId = localStorage.getItem('userId');

  if (!authorId) {
    return (
      <div className="App">
        <h1>Create Post</h1>
        <p>Please <a href="/login">login</a> to create a post.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/posts', { title, content, author_id: parseInt(authorId) });
      setTitle('');
      setContent('');
      window.location.href = '/';
    } catch (err) {
      setError('Error creating post: ' + (err.response?.data || 'Failed'));
    }
  };

  return (
    <div className="App">
      <h1>Create Post</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Create;
