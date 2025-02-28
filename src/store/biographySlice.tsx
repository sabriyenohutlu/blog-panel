import {db} from "../firebase";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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
    bioOfWho: string;
    rating: number;
    themes: string[];
    period: string;
    excerpt: string;
    location: string;
    famousWorks: string[];
    biography_category: string;
    year_birth: string;
    year_death: string;
};
type BiographyState = {
    biographies: NewBiographyType[]; // İnceleme verilerini tutan array
    loading: boolean; // Veri yükleme durumu
    error: string | null; // Hata durumu
};
const initialState: BiographyState = {
    biographies: [],
    loading: false,
    error: null,
};
export const fetchBio = createAsyncThunk<
NewBiographyType[], // Başarı durumunda dönecek veri tipi
    void, // Parametre tipi (yoksa void)
    { rejectValue: string } // Hata durumunda dönecek değer tipi
>('biographies/fetchBio', async (_, { rejectWithValue }) => {
    try {
        const bioCollection = collection(db, 'biography');
        const q = query(bioCollection, orderBy('createdAt', 'desc')); // 'desc' ya da 'asc' sıralama yönü
        const querySnapshot = await getDocs(q);

        // Firestore'dan gelen veriyi mapleyerek `NovelReviewType[]` türüne dönüştür
        const biographies: NewBiographyType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                biography_id: data.biography_id,
                biograph_headImage: data.biograph_headImage,
                biography_title: data.biography_title,
                biography_summaryInfo: data.biography_summaryInfo,
                category_id: data.category_id,
                subCategory_id: data.subCategory_id,
                subCategory_name: data.subCategory_name,
                author_id: data.author_id,
                status: data.status,
                tags: data.tags, //gönderirken tags ekle yolla
                biography_recordedDate: data.biography_recordedDate,
                comments: data.comments,
                likes: data.likes,
                dislikes: data.dislikes,
                url: data.url,
                view_count: data.view_count,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                bioOfWho: data.bioOfWho,
                rating: data.rating,
                themes: data.themes,
                period: data.period,
                excerpt: data.excerpt,
                location: data.location,
                famousWorks: data.famousWorks,
                biography_category: data.biography_category,
                year_birth: data.year_birth,
                year_death: data.year_death
            };
        });

        return biographies; // Veri döndürülüyor
    } catch (error) {
        return rejectWithValue('novel review Veri çekme hatası');
    }
});

const bioSlice = createSlice({
    name: 'biography', // Slice adı
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // `fetchReviews` işleminin başarı durumunda:
        builder.addCase(fetchBio.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchBio.fulfilled, (state, action) => {
            state.loading = false;
            state.biographies = action.payload;
        });
        // `fetchReviews` işleminin hata durumunda:
        builder.addCase(fetchBio.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});
export default bioSlice.reducer;