"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

import Profile from '@components/Profile';

const GeneralProfileView = () => {
	const router = useRouter();
	const pathName = usePathname();
  const [posts, setPosts] = useState([]);
	const searchParams = useSearchParams();

	let profileId, profileName = '';  

  useEffect(() => {
		// pathName pattern: '/profile/profileId'
		if (pathName) profileId = pathName.split('/')[2];

    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${profileId}/posts`);
      const data = await response.json();
      setPosts(data);
    }

    fetchPosts();
  }, []);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  }

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, { method: 'DELETE'});
        const filteredPosts = posts.filter((p) => p._id !== post._id);
        setPosts(filteredPosts);

      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Profile
      name={searchParams && searchParams.get('name')}
      desc={searchParams && 
				`Welcome to ${searchParams.get('name')} profile page. 
				Explore ${searchParams.get('name')}'s exceptional prompts and be inspired by 
				the power of their imagination`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default GeneralProfileView;