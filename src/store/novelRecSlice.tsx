import {db} from "../firebase";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
type NovelRecType = {
    novel_recId: number;
    novel_name: string;
    novel_headImage: string;
    novel_recTitle: string;
    novel_summaryInfo: string;
    body: string;
    category_id: number;
    subCategory_id: number;
    subCategory_name: string;
    author_id: string;
    status: string;
    tags: string[];
    url: string;
    bookauthor_id: string;
    bookauthor_name: string;
    novel_recordedDate: any;
    comments: string[];
    likes: number;
    dislikes: number;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    rating: number;
    novel_bookCategory: string[]; // Array of category IDs
    themes: string[];
};
type NovelRecState = {
    recommendations: NovelRecType[]; // İnceleme verilerini tutan array
    loading: boolean; // Veri yükleme durumu
    error: string | null; // Hata durumu
};
const initialState: NovelRecState = {
    recommendations: [],
    loading: false,
    error: null,
};
export const fetchRec = createAsyncThunk<
    NovelRecType[], // Başarı durumunda dönecek veri tipi
    void, // Parametre tipi (yoksa void)
    { rejectValue: string } // Hata durumunda dönecek değer tipi
>('recommendations/fetchRec', async (_, { rejectWithValue }) => {
    try {
        const reviewsCollection = collection(db, 'novelRecommendation');
        const q = query(reviewsCollection, orderBy('createdAt', 'desc')); // 'desc' ya da 'asc' sıralama yönü
        const querySnapshot = await getDocs(q);

        // Firestore'dan gelen veriyi mapleyerek `NovelReviewType[]` türüne dönüştür
        const recommendations: NovelRecType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                novel_recId: data.novel_recId,
                novel_name: data.novel_name,
                novel_headImage: data.novel_headImage,
                novel_recTitle: data.novel_recTitle,
                novel_summaryInfo: data.novel_summaryInfo,
                category_id: data.category_id,
                subCategory_id: data.subCategory_id,
                body: data.body,
                subCategory_name: data.subCategory_name,
                author_id: data.author_id,
                status: data.status,
                tags: data.tags,
                bookauthor_id: data.bookauthor_id,
                bookauthor_name: data.bookauthor_name,
                novel_recordedDate: data.novel_recordedDate,
                comments: data.comments, // Gerekirse daha spesifik bir tip verebilirsiniz
                likes: data.likes,
                dislikes: data.dislikes,
                url: data.url,
                view_count: data.view_count,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                rating: data.rating,
                novel_bookCategory: data.novel_bookCategory, // Gerekirse daha spesifik bir tip verebilirsiniz
                themes: data.themes,
            };
        });

        return recommendations; // Veri döndürülüyor
    } catch (error) {
        return rejectWithValue('novel review Veri çekme hatası');
    }
});

const novelRecSlice = createSlice({
    name: 'novelRecommendation', // Slice adı
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // `fetchReviews` işleminin başarı durumunda:
        builder.addCase(fetchRec.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchRec.fulfilled, (state, action) => {
            state.loading = false;
            state.recommendations = action.payload;
        });
        // `fetchReviews` işleminin hata durumunda:
        builder.addCase(fetchRec.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});
export default novelRecSlice.reducer;