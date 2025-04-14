import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

type NovelReviewType = {
    novel_reviewId: number;
    novel_name: string;
    novel_headImage: string;
    novel_reviewTitle: string;
    novel_summaryInfo: string;
    body: string;
    category_id: number;
    subCategory_id: number;
    subCategory_name: string;
    author_id: string;
    pinned: boolean;
    status: string;
    subCategory_title: string;
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
    period: string;
};

type NovelReviewState = {
    reviews: NovelReviewType[]; // İnceleme verilerini tutan array
    loading: boolean; // Veri yükleme durumu
    error: string | null; // Hata durumu
};

const initialState: NovelReviewState = {
    reviews: [],
    loading: false,
    error: null,
};

export const fetchReviews = createAsyncThunk<
    NovelReviewType[], // Başarı durumunda dönecek veri tipi
    void, // Parametre tipi (yoksa void)
    { rejectValue: string } // Hata durumunda dönecek değer tipi
>('reviews/fetchReviews', async (_, { rejectWithValue }) => {
    try {
        const reviewsCollection = collection(db, 'novelReview');
        const q = query(reviewsCollection, orderBy('createdAt', 'desc')); // 'desc' ya da 'asc' sıralama yönü
        const querySnapshot = await getDocs(q);

        // Firestore'dan gelen veriyi mapleyerek `NovelReviewType[]` türüne dönüştür
        const reviews: NovelReviewType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                novel_reviewId: data.novel_reviewId,
                novel_name: data.novel_name,
                novel_headImage: data.novel_headImage,
                subCategory_title: data.subCategory_title,
                novel_reviewTitle: data.novel_reviewTitle,
                novel_summaryInfo: data.novel_summaryInfo,
                category_id: data.category_id,
                subCategory_id: data.subCategory_id,
                subCategory_name: data.subCategory_name,
                author_id: data.author_id,
                pinned: data.pinned,
                status: data.status,
                body: data.body,
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
                period: data.period,
            };
        });

        return reviews; // Veri döndürülüyor
    } catch (error) {
        return rejectWithValue('novel review Veri çekme hatası');
    }
});

const novelReviewSlice = createSlice({
    name: 'novelReview', // Slice adı
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // `fetchReviews` işleminin başarı durumunda:
        builder.addCase(fetchReviews.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.reviews = action.payload;
        });
        // `fetchReviews` işleminin hata durumunda:
        builder.addCase(fetchReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

// Reducer
export default novelReviewSlice.reducer;
