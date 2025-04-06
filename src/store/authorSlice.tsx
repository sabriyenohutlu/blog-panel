import { db } from '../firebase';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
type AuthorType = {
    author_id: string;
    author_name: string;
    created_date: any;
    mainCategory_name: string;
    mainCategory_title: string;
    updated_date: any;
};
type AuthorState = {
    authors: AuthorType[];
    loading: boolean;
    error: string | null;
};
const initialState: AuthorState = {
    authors: [],
    loading: false,
    error: null,
};
export const fetchAuthors = createAsyncThunk<AuthorType[], void, { rejectValue: string }>('authors/fetchAuthors', async (_, { rejectWithValue }) => {
    try {
        const authorCollection = collection(db, 'author');
        const q = query(authorCollection, orderBy('created_date', 'desc'));
        const querySnapshot = await getDocs(q);
        const authors: AuthorType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                author_id: data.author_id,
                author_name: data.author_name,
                created_date: data.created_date,
                mainCategory_name: data.mainCategory_name,
                mainCategory_title: data.mainCategory_title,
                updated_date: data.updated_date
            };
        });
        return authors;
    } catch (error) {
        return rejectWithValue('Hata oluştu');
    }
});

const authorSlice = createSlice({
    name: 'authors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAuthors.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAuthors.fulfilled, (state, action) => {
            state.authors = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchAuthors.rejected, (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
        });
    },
});
export default authorSlice.reducer;