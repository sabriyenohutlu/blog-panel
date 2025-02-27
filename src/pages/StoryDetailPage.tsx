import StoryDetail from '../components/Story/StoryDetail'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
const StoryDetailPage = () => {
  const { story_id } = useParams();
  const [thisStory, setThisStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyBody, setStoryBody] = useState<string | null>('');

  useEffect(() => {
    const fetchNovelReview = async () => {
      try {
        // Fetch the main novel review document first
        const docRef = doc(db, "novelReview", story_id!);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setThisStory(docSnap.data());

          // Now fetch the reviewBody sub-collection
          const reviewBodyRef = collection(docRef, "reviewBody");
          const reviewBodySnap = await getDocs(reviewBodyRef);
          
          if (!reviewBodySnap.empty) {
            reviewBodySnap.forEach((doc) => {
              const bodyData = doc.data();
              setStoryBody(bodyData.body); // Assuming 'body' field is inside each document
            });
          } else {
            console.log("No review body found in the sub-collection");
            setStoryBody("No body content available.");
          }
        } else {
          console.log("No such document found for this review!");
          setStoryBody(null); // Handle case where main review doesn't exist
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovelReview();
  }, [story_id]);

  console.log("novelReview",thisStory)
  console.log("reviewBody",storyBody)

if (loading) {
    return <div>Loading...</div>;
}

if (error) {
    return <div>{error}</div>;
}

  return (
    <StoryDetail thisStory={thisStory} storyBody={storyBody}/>
  )
}

export default StoryDetailPage