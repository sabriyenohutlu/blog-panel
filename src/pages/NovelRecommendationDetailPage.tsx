import { useParams } from 'react-router-dom';
import NovelRecommendationDetail from '../components/Novel/NovelRecommendation/NovelRecommendationDetail';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const NovelReviewDetailPage = () => {
    const { novel_recId } = useParams();
    const [novelRec, setNovelRec] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recBody, setRecBody] = useState<string>('');

    useEffect(() => {
        const fetchNovelRec = async () => {
          try {
            // Fetch the main novel review document first
            const docRef = doc(db, "novelRecommendation", novel_recId!);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
              setNovelRec(docSnap.data());
    
              // Now fetch the reviewBody sub-collection
              const recBodyRef = collection(docRef, "recBody");
              const recBodySnap = await getDocs(recBodyRef);
              
              if (!recBodySnap.empty) {
                recBodySnap.forEach((doc) => {
                  const bodyData = doc.data();
                  setRecBody(bodyData.body); // Assuming 'body' field is inside each document
                });
              } else {
                console.log("No review body found in the sub-collection");
                setRecBody("No body content available.");
              }
            } else {
              console.log("No such document found for this review!");
              setNovelRec(null); // Handle case where main review doesn't exist
            }
          } catch (error) {
            console.error("Error fetching document: ", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchNovelRec();
      }, [novel_recId]);

      console.log("novelRec",novelRec)
      console.log("recBody",recBody)

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
     return <NovelRecommendationDetail novelRec={novelRec} recBody={recBody}/>;

};

export default NovelReviewDetailPage;