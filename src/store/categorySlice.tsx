import { db } from '../firebase';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
type CategoryType = {
    category_id: string;
    category_name: string;
    category_title: string;
    created_date: any;
    mainCategory_id: string;
    mainCategory_name: string;
    mainCategory_title: string;
    updated_date: any;
};
type CategoryState = {
    categories: CategoryType[];
    loading: boolean;
    error: string | null;
};
const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};
export const fetchCategories = createAsyncThunk<CategoryType[], void, { rejectValue: string }>('categories/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const categoryCollection = collection(db, 'categories');
        const q = query(categoryCollection, orderBy('created_date', 'desc'));
        const querySnapshot = await getDocs(q);
        const categories: CategoryType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                category_id: data.category_id,
                category_name: data.category_name,
                category_title: data.category_title,
                created_date: data.created_date,
                mainCategory_id: data.mainCategory_id,
                mainCategory_name: data.mainCategory_name,
                mainCategory_title: data.mainCategory_title,
                updated_date: data.updated_date,
            };
        });
        return categories;
   
    } catch (error) {
        return rejectWithValue('Hata oluştu');
    }
});

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
        });
    },
});
export default categoriesSlice.reducer;
