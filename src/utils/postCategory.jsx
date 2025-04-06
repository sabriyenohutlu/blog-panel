import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostCategories } from "../store/postCategorySlice"

const PostCategory = () => {
   const postCategories = useSelector((state) => state.postCategories.postCategories);
    const dispatch = useDispatch()
     useEffect(() => {
           dispatch(fetchPostCategories());
       }, [dispatch]);
 
   let groupNames = postCategories.reduce((result, item) => {
    result[item.whatsCategory] = []
    return result;
  }, {});


  Object.keys(groupNames).forEach(whatsCategory => {
    let findCategories = postCategories.filter(i => i.whatsCategory == whatsCategory);
    groupNames[whatsCategory] =  Object.values(findCategories);
  });

  // const options = groupNames["Roman"]
  // .map(({ postCategory_name }) => ({
  //     value: postCategory_name,
  //    label: postCategory_name,
  //  }));

  return (
    <></>
  )
}

export default PostCategory
