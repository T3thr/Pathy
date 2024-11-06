// novel/[title]/read/page.js
import React, { useState, useEffect } from 'react';
import ReadNovel from '@/components/contents/read/ReadNovel'; // Adjust the import path as necessary
import { novels } from '@/data/novels'; // Import the novels data
import { stories } from '@/data/story'; // Import the story logic (with choices)

export default function ReadPage({ params }) {
  const [novelContent, setNovelContent] = useState(null);
  const [choices, setChoices] = useState([]);
  const [storyState, setStoryState] = useState(null);
  
  // Decode the title from the URL
  const title = decodeURIComponent(params.title);
  
  // Find the corresponding novel details based on the title
  const novelDetails = novels.find(novel => novel.title === title);

  useEffect(() => {
    if (novelDetails) {
      // Fetch story and choices from the data/story.js based on the selected novel title
      const storyData = stories(novelDetails.title);
      setNovelContent(storyData.content);
      setChoices(storyData.choices);
      setStoryState(storyData.state);
    }
  }, [novelDetails]);

  const handleChoiceSelect = (choice) => {
    // Update the state based on the user's choice
    const updatedStory = stories(novelDetails.title, choice.nextState);
    setNovelContent(updatedStory.content);
    setChoices(updatedStory.choices);
    setStoryState(updatedStory.state);
  };

  return (
    <div>
      {novelDetails ? (
        <ReadNovel 
          title={novelDetails.title} 
          content={novelContent} 
          choices={choices}
          onChoiceSelect={handleChoiceSelect} 
        />
      ) : (
        <p>Novel not found</p>
      )}
    </div>
  );
}
