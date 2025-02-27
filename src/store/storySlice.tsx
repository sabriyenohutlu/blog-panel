import {db} from "../firebase";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

type StoryType = {
    story_id: number;
    story_name: string;
    story_headImage: string;
    story_title: string;
    story_summaryInfo: string;
    body: string;
    category_id: number;
    subCategory_id: number;
    subCategory_name: string;
    author_id: number;
    status: string;
    tags: string[];
    url: string;
    storyauthor_id: string;
    storyauthor_name: string;
    story_recordedDate: any;
    comments: string[];
    likes: number;
    dislikes: number;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    rating: number;
    story_category: string[]; // Array of category IDs
    period: string;
    themes: string[];
};
type StoryState = {
    stories: StoryType[]; // İnceleme verilerini tutan array
    loading: boolean; // Veri yükleme durumu
    error: string | null; // Hata durumu
};
const initialState: StoryState = {
    stories: [],
    loading: false,
    error: null,
};
export const fetchStory = createAsyncThunk<
StoryType[], // Başarı durumunda dönecek veri tipi
    void, // Parametre tipi (yoksa void)
    { rejectValue: string } // Hata durumunda dönecek değer tipi
>('stories/fetchStory', async (_, { rejectWithValue }) => {
    try {
        const storyCollection = collection(db, 'story');
        const q = query(storyCollection, orderBy('createdAt', 'desc')); // 'desc' ya da 'asc' sıralama yönü
        const querySnapshot = await getDocs(q);

        // Firestore'dan gelen veriyi mapleyerek `NovelReviewType[]` türüne dönüştür
        const stories: StoryType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                story_id: data.story_id,
                story_name: data.story_name,
                story_headImage: data.story_headImage,
                story_title: data.story_title,
                story_summaryInfo: data.story_summaryInfo,
                body: data.body,
                category_id: data.category_id,
                subCategory_id: data.subCategory_id,
                subCategory_name: data.subCategory_name,
                author_id: data.author_id,
                status: data.status,
                tags: data.tags,
                url: data.url,
                storyauthor_id: data.storyauthor_id,
                storyauthor_name: data.storyauthor_name,
                story_recordedDate: data.story_recordedDate,
                comments: data.comments,
                likes: data.likes,
                dislikes: data.dislikes,
                view_count: data.view_count,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                rating: data.rating,
                story_category:data.story_category, // Array of category IDs
                period: data.period,
                themes: data.themes
            };
        });

        return stories; // Veri döndürülüyor
    } catch (error) {
        return rejectWithValue('novel review Veri çekme hatası');
    }
});
const storySlice = createSlice({
    name: 'story', // Slice adı
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // `fetchReviews` işleminin başarı durumunda:
        builder.addCase(fetchStory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchStory.fulfilled, (state, action) => {
            state.loading = false;
            state.stories = action.payload;
        });
        // `fetchReviews` işleminin hata durumunda:
        builder.addCase(fetchStory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});
export default storySlice.reducer;