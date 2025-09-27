import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`/api/posts?search=${search}`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, [search]);

  const deletePost = (id) => {
    axios.delete(`/api/posts/${id}`)
      .then(() => setPosts(posts.filter(post => post.id !== id)))
      .catch(err => console.error(err));
  };

  if (!userId) {
    return (
      <div className="App">
        <h1>Blog Platform</h1>
        <p>Please <a href="/login">login</a> to view posts.</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Blog Platform</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search posts..."
      />
      {posts.map(post => (
        <div key={post.id} className="post">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>By {post.username} at {post.created_at}</p>
          {post.author_id === parseInt(userId) && (
            <button onClick={() => deletePost(post.id)}>Delete</button>
          )}
        </div>
      ))}
      <a href="/create">Create Post</a>
      <button onClick={() => { localStorage.removeItem('userId'); window.location.href = '/login'; }}>
        Logout
      </button>
    </div>
  );
}

export default App;
