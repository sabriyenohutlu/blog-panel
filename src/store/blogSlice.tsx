import { db } from '../firebase';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
type BlogType = {
    blog_id: number;
    blog_title: string;
    blog_headImage: string;
    blog_summaryInfo: string;
    body: string;
    category_id: number;
    category_name: string;
    subCategory_id: number;
    subCategory_name: string;
    author_id: string;
    status: string;
    tags: string[];
    url: string;
    pinned: boolean;
    blog_recordedDate: any;
    comments: string[];
    likes: number;
    author_name: string;
    dislikes: number;
    subCategory_title: string;
    view_count: number;
    category_title: string;
    createdAt: any;
    updatedAt: any;
    rating: number;
};

type BlogState = {
    blogs: BlogType[];
    loading: boolean;
    error: string | null;
};
const initialState: BlogState = {
    blogs: [],
    loading: false,
    error: null,
};

export const fetchBlogs = createAsyncThunk<BlogType[], void, { rejectValue: string }>('blogs/fetchBlogs', async (_, { rejectWithValue }) => {
    try {
        const blogCollection = collection(db, 'blog');
        const q = query(blogCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const blogs: BlogType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                blog_id: data.blog_id,
                blog_title: data.blog_title,
                blog_headImage: data.blog_headImage,
                blog_summaryInfo: data.blog_summaryInfo,
                pinned:data.pinned,
                body: data.body,
                category_id: data.category_id,
                category_name: data.category_name,
                subCategory_id: data.subCategory_id,
                subCategory_name: data.subCategory_name,
                author_id: data.author_id,
                status: data.status,
                tags: data.tags,
                url: data.url,
                blog_recordedDate: data.blog_recordedDate,
                comments: data.comments,
                likes: data.likes,
                author_name: data.author_name,
                dislikes: data.dislikes,
                subCategory_title: data.subCategory_title,
                view_count: data.view_count,
                category_title: data.category_title,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                rating: data.rating
            };
        });
        return blogs;
    } catch (error) {
        return rejectWithValue('Hata oluştu');
    }
});

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {},
    extraReducers:(builder)=> {
        builder.addCase(fetchBlogs.pending,(state)=> {
            state.loading = true;
        });
        builder.addCase(fetchBlogs.fulfilled,(state,action)=> {
            state.blogs = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchBlogs.rejected,(state, action) => {
            state.error = action.payload as string;
            state.loading = false;
        })

    }
})
export default blogSlice.reducer;
