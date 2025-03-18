import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "../firebase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "store";
import { collection, getDocs } from "firebase/firestore";
export interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    uid: string | null;
    usersList: User[] | null;
  }
  
  const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    uid: null,
    usersList: null
  };

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
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
    },
});
export const { setUser, setLoading, setError,setUsersList  } = userSlice.actions;
export default userSlice.reducer;

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const querySnapshot = await getDocs(collection(db, "user")); // Firestore'daki "users" koleksiyonunu çek
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as User); // Kullanıcı verisini diziye ekle
    });
    dispatch(setUsersList(users)); // Kullanıcıları store'a ekle
    dispatch(setLoading(false));
  } catch (error: any) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const listenToAuthChanges = () => (dispatch: AppDispatch) => {
  dispatch(setLoading(true)); // Yükleme durumu başlat

  onAuthStateChanged(auth, async(currentUser) => {
    if (currentUser) {
      dispatch(setUser(currentUser));
      localStorage.setItem("user", JSON.stringify(currentUser));
      dispatch(setError(null));
    } else {
      dispatch(setUser(null));
      localStorage.removeItem("user");
    }
    dispatch(setLoading(false)); // Yükleme tamamlandı
  });
};
export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await signOut(auth);
    dispatch(setUser(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};