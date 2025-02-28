import {db} from "../firebase";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
type NewPoetryType = {
    poetry_id: number;
    poetry_name: string;
    poetry_headImage: string;
    poetry_title: string;
    poetry_summaryInfo: string;
    category_id: number; //307123
    subCategory_id: number; //307101
    subCategory_name: string;
    author_id: string;
    status: string;
    tags: string[]; //gönderirken tags ekle yolla
    poetryauthor_id: string;
    poetryauthor_name: string;
    poetry_recordedDate: any;
    comments: string[];
    likes: number;
    body:string;
    dislikes: number;
    url: string;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    poetryOfWho:string;
    rating: number;
    poetry_category: string[];
    themes: string[];
};
type PoetryState = {
    poetries: NewPoetryType[]; // İnceleme verilerini tutan array
    loading: boolean; // Veri yükleme durumu
    error: string | null; // Hata durumu
};
const initialState: PoetryState = {
    poetries: [],
    loading: false,
    error: null,
};
export const fetchPoetry = createAsyncThunk<
NewPoetryType[], // Başarı durumunda dönecek veri tipi
    void, // Parametre tipi (yoksa void)
    { rejectValue: string } // Hata durumunda dönecek değer tipi
>('poetries/fetchPoetry', async (_, { rejectWithValue }) => {
    try {
        const bioCollection = collection(db, 'poetry');
        const q = query(bioCollection, orderBy('createdAt', 'desc')); // 'desc' ya da 'asc' sıralama yönü
        const querySnapshot = await getDocs(q);

        // Firestore'dan gelen veriyi mapleyerek `NovelReviewType[]` türüne dönüştür
        const poetries: NewPoetryType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                poetry_id: data.poetry_id,
                poetry_name: data.poetry_name,
                poetry_headImage: data.poetry_headImage,
                poetry_title: data.poetry_title,
                poetry_summaryInfo: data.poetry_summaryInfo,
                category_id: data.category_id, 
                subCategory_id: data.subCategory_id, 
                subCategory_name: data.subCategory_name,
                author_id: data.author_id,
                status: data.status,
                tags: data.tags, //gönderirken tags ekle yolla
                poetryauthor_id: data.poetryauthor_id,
                poetryauthor_name: data.poetryauthor_name,
                poetry_recordedDate: data.poetry_recordedDate,
                comments: data.comments,
                likes: data.likes,
                body:data.body,
                dislikes: data.dislikes,
                url: data.url,
                view_count: data.view_count,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                poetryOfWho:data.poetryOfWho,
                rating: data.rating,
                poetry_category: data.poetry_category,
                themes: data.themes
            };
        });

        return poetries; // Veri döndürülüyor
    } catch (error) {
        return rejectWithValue('siir Veri çekme hatası');
    }
});

const poetrySlice = createSlice({
    name: 'poetry', // Slice adı
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // `fetchReviews` işleminin başarı durumunda:
        builder.addCase(fetchPoetry.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPoetry.fulfilled, (state, action) => {
            state.loading = false;
            state.poetries = action.payload;
        });
        // `fetchReviews` işleminin hata durumunda:
        builder.addCase(fetchPoetry.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});
export default poetrySlice.reducer;