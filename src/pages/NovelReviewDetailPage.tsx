import { useParams } from 'react-router-dom';
import NovelReviewDetail from '../components/Novel/NovelReview/NovelReviewDetail';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const NovelReviewDetailPage = () => {
    const { novel_reviewId } = useParams();
    const [novelReview, setNovelReview] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviewBody, setReviewBody] = useState<string>('');

    useEffect(() => {
        const fetchNovelReview = async () => {
          try {
            // Fetch the main novel review document first
            const docRef = doc(db, "novelReview", novel_reviewId!);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
              setNovelReview(docSnap.data());
    
              // Now fetch the reviewBody sub-collection
              const reviewBodyRef = collection(docRef, "reviewBody");
              const reviewBodySnap = await getDocs(reviewBodyRef);
              
              if (!reviewBodySnap.empty) {
                reviewBodySnap.forEach((doc) => {
                  const bodyData = doc.data();
                  setReviewBody(bodyData.body); // Assuming 'body' field is inside each document
                });
              } else {
                console.log("No review body found in the sub-collection");
                setReviewBody("No body content available.");
              }
            } else {
              console.log("No such document found for this review!");
              setNovelReview(null); // Handle case where main review doesn't exist
            }
          } catch (error) {
            console.error("Error fetching document: ", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchNovelReview();
      }, [novel_reviewId]);

      console.log("novelReview",novelReview)
      console.log("reviewBody",reviewBody)

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
     return <NovelReviewDetail novelReview={novelReview} reviewBody={reviewBody}/>;

};

export default NovelReviewDetailPage;
