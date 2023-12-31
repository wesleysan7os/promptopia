"use client";

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
}

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);

  const handleSearchChange = async (e) => {
    const searchTextValue = e.target.value;
    setSearchText(searchTextValue);
    fetchPosts(searchTextValue);
  }
  
  const fetchPosts = async (searchTextValue) => {
    const response = await fetch(`/api/prompt?filter=${searchTextValue}`);
    if (response.status === 204) setPosts([]);
    else {
      const data = await response.json();
      setPosts(data);
    }
  }

  const handleTagClick = (postTagText) => {
    setSearchText(postTagText);
    fetchPosts(postTagText);
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setPosts(data);
    }

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input 
          type="text"
          name="search"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={handleTagClick}
      />

    </section>
  )
}

export default Feed