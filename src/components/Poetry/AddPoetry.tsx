import React from 'react'
type NewPoetryType = {
  poetry_id: number;
  poetry_name: string;
  poetry_headImage: string;
  poetry_title: string;
  poetry_summaryInfo: string;
  category_id: number;//307123
  subCategory_id: number;//307101
  subCategory_name: string;
  author_id: string;
  status: string;
  tags: string[]; //gönderirken tags ekle yolla
  poetryauthor_id: string;
  poetryauthor_name:string;
  poetry_recordedDate: any;
  comments: string[];
  likes: number;
  dislikes: number;
  url: string;
  view_count: number;
  createdAt: any;
  updatedAt: any;
  rating: number;
  poetry_category: string[];
  themes:string[]
};
const AddPoetry = () => {
  return (
    <div>AddPoetry</div>
  )
}

export default AddPoetry