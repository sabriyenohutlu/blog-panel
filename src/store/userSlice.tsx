import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from 'store';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
export interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    uid: string | null;
    usersList: User[] | null;
    userData: [] | null;
    totalUsers: number;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    uid: null,
    usersList: null,
    totalUsers: 0,
    userData: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setUsersList: (state, action: PayloadAction<User[] | null>) => {
            state.usersList = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setTotalUsers: (state, action: PayloadAction<number>) => {
            state.totalUsers = action.payload;
        },
    },
});
export const { setUser, setLoading, setError, setUsersList, setUserData,setTotalUsers } = userSlice.actions;
export default userSlice.reducer;

export const fetchUsers = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const querySnapshot = await getDocs(collection(db, 'user')); // Firestore'daki "users" koleksiyonunu çek
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data() as User); // Kullanıcı verisini diziye ekle
        });
        const totalUsers = querySnapshot.size;
        console.log(totalUsers)
        dispatch(setUsersList(users)); // Kullanıcıları store'a ekle
        dispatch(setTotalUsers(totalUsers));
        dispatch(setLoading(false));
    } catch (error: any) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};
export const listenToAuthChanges = () => (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            dispatch(setUser(currentUser));

            const userRef = doc(db, 'user', currentUser.uid);
            try {
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    dispatch(setUserData(userData)); // Redux store'a Firestore'daki user verisini ekle
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    console.log('Kullanıcı bulunamadı.');
                    dispatch(setUserData(null));
                    localStorage.removeItem('user');
                }
            } catch (error: any) {
                console.error('Firestore verisi alınırken hata oluştu:', error);
                dispatch(setError(error.message));
            }
        } else {
            dispatch(setUser(null));
            dispatch(setUserData(null));
            localStorage.removeItem('user');
        }

        dispatch(setLoading(false));
    });
};

export const logoutUser = (e: any, go: any) => async (dispatch: AppDispatch) => {
    try {
        await signOut(auth);
        dispatch(setUser(null));
        go();
    } catch (error: any) {
        dispatch(setError(error.message));
        console.log(error);
    }
};
