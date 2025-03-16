import {db} from "../firebase";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
type DailyWordType = {
    dailyWord_id: number;
    dailyWord_title: string;
    category_id: number;
    subCategory_id: number;
    subCategory_name: string;
    author_id: number;
    status: string;
    tags: string[];
    dailyWord_authorId: string;
    dailyWord_authorName: string;
    dailyWord_recordedDate: any;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    dailyWord_category: string[];
};
type DailyWordState = {
    dailyWords: DailyWordType[]; // İnceleme verilerini tutan array     
    loading: boolean,
    error: string | null;
}
const initialState: DailyWordState = {
    dailyWords: [],
    loading: false,
    error: null,
};
export const fetchDailyWord = createAsyncThunk<
    DailyWordType[], // Başarı durumunda dönecek veri tipi
    void, // Parametre tipi (yoksa void)
    { rejectValue: string } // Hata durumunda dönecek değer tipi
    >('dailyWords/fetchDailyWord', async (_, { rejectWithValue }) => {
    try {
        const dailyWordCollection = collection(db, 'dailyWord');
        const q = query(dailyWordCollection, orderBy('createdAt', 'desc')); // 'desc' ya da 'asc' sıralama yönü
        const querySnapshot = await getDocs(q);
        // Firestore'dan gelen veriyi mapleyerek `NovelReviewType[]` türüne dönüştür
        const dailyWords: DailyWordType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                dailyWord_id: data.dailyWord_id,
                dailyWord_title: data.dailyWord_title,
                category_id: data.category_id,
                subCategory_id: data.subCategory_id,
                subCategory_name: data.subCategory_name,
                author_id: data.author_id,
                status: data.status,
                tags: data.tags,
                dailyWord_authorId: data.dailyWord_authorId,
                dailyWord_authorName: data.dailyWord_authorName,
                dailyWord_recordedDate: data.dailyWord_recordedDate,
                dailyWord_category: data.dailyWord_category,
                likes: data.likes,
                dislikes: data.dislikes,
                view_count: data.view_count,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            };
        });
        return dailyWords;
    } catch (error) {
        return rejectWithValue('Hata oluştu');
    }   });
const dailyWordSlice = createSlice({    
    name: 'dailyWord',    
    initialState,    
    reducers: {},    
    extraReducers: (builder) => {        
        builder.addCase(fetchDailyWord.pending, (state) => {            
            state.loading = true;        
        });        
        builder.addCase(fetchDailyWord.fulfilled, (state, action) => {            
            state.dailyWords = action.payload;            
            state.loading = false;        
        });        
        builder.addCase(fetchDailyWord.rejected, (state, action) => {            
            state.error = action.payload as string;            
            state.loading = false;        
        });    
    },
});
export default dailyWordSlice.reducer;