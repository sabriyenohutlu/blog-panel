import React from 'react'
type NewBiographyType = {
  biography_id: number;
  biograph_headImage: string;
  biography_title: string;
  biography_summaryInfo: string;
  category_id: number;
  subCategory_id: number;
  subCategory_name: string;
  author_id: string;
  status: string;
  tags: string[]; //gönderirken tags ekle yolla
  biography_recordedDate: any;
  comments: string[];
  likes: number;
  dislikes: number;
  url: string;
  view_count: number;
  createdAt: any;
  updatedAt: any;
  rating: number;
  themes:string[];
  period:string;
  excerpt:string;
  location:string;
  famousWorks:string[];
  biography_category:string;
  year_birth:string;
  year_death:string;
};
const AddBiography = () => {
  return (
    <div>AddBiography</div>
  )
}

export default AddBiography