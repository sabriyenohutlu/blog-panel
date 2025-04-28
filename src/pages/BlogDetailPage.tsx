import { useParams } from 'react-router-dom';
import BlogDetail from '../components/Blog/BlogDetail';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const BlogDetailPage = () => {
    const { blog_id } = useParams();
    const [thisBlog, setThisBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [blogBody, setBlogBody] = useState<string>('');


    useEffect(() => {
           const fetchNovelRec = async () => {
             try {
               // Fetch the main novel review document first
               const docRef = doc(db, "blog", blog_id!);
               const docSnap = await getDoc(docRef);
       
               if (docSnap.exists()) {
                setThisBlog(docSnap.data());
       
                 // Now fetch the reviewBody sub-collection
                 const recBodyRef = collection(docRef, "blogBody");
                 const recBodySnap = await getDocs(recBodyRef);
                 
                 if (!recBodySnap.empty) {
                   recBodySnap.forEach((doc) => {
                     const bodyData = doc.data();
                     setBlogBody(bodyData.body); // Assuming 'body' field is inside each document
                   });
                 } else {
                   console.log("No review body found in the sub-collection");
                   setBlogBody("No body content available.");
                 }
               } else {
                 console.log("No such document found for this review!");
                 setThisBlog(null); // Handle case where main review doesn't exist
               }
             } catch (error) {
               console.error("Error fetching document: ", error);
             } finally {
               setLoading(false);
             }
           };
       
           fetchNovelRec();
         }, [blog_id]);
   
         console.log("novelRec",thisBlog)
         console.log("recBody",blogBody)
   
       if (loading) {
           return <div>Loading...</div>;
       }
   
       if (error) {
           return <div>{error}</div>;
       }

    return <BlogDetail thisBlog={thisBlog} blogBody={blogBody}/>;
};

export default BlogDetailPage;
