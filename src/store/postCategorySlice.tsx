import { db } from '../firebase';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
type PostCategoryType = {
    createdAt: any;
    postCategory_id: string;
    postCategory_name: string;
    status: string;
    updatedAt: any;
    whatsCategory: string[];
};
type PostCategoryState = {
    postCategories: PostCategoryType[];
    loading: boolean;
    error: string | null;
};
const initialState: PostCategoryState = {
    postCategories: [],
    loading: false,
    error: null,
};
export const fetchPostCategories = createAsyncThunk<PostCategoryType[], void, { rejectValue: string }>('postCategories/fetchPostCategories', async (_, { rejectWithValue }) => {
    try {
        const postCategoryCollection = collection(db, 'postCategory');
        const q = query(postCategoryCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postCategories: PostCategoryType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                postCategory_id: data.postCategory_id,
                postCategory_name: data.postCategory_name,
                createdAt: data.createdAt,
                status: data.status,
                updatedAt: data.updatedAt,
                whatsCategory: data.whatsCategory,
            };
        });
        return postCategories;
    } catch (error) {
        return rejectWithValue('Hata oluştu');
    }
});

const postCategorySlice = createSlice({
    name: 'postCategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPostCategories.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPostCategories.fulfilled, (state, action) => {
            state.postCategories = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchPostCategories.rejected, (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
        });
    },
});
export default postCategorySlice.reducer;
