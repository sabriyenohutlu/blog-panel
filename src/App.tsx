import {  useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from './store';
import { toggleRTL, toggleTheme, toggleLocale, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from './store/themeConfigSlice';
import store from './store';
import { listenToAuthChanges } from "../src/store/userSlice";
import { AppDispatch } from './store';
import { routes, authRoutes } from './router/routes';
import BlankLayout from '../src/components/Layouts/BlankLayout';
import DefaultLayout from '../src/components/Layouts/DefaultLayout';
import { createBrowserRouter, RouterProvider,RouteObject  } from 'react-router-dom';
import LoadingPage from "../src/pages/LoadingPage";
import ErrorPage from '../src/pages/ErrorPage';
import { onAuthStateChanged,User } from 'firebase/auth';
import { auth, db } from "./firebase";
import { doc, getDoc } from 'firebase/firestore';

function App() {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [user ,setUser] = useState<User | null>(null)
    const[loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    const appDispatch = useDispatch<AppDispatch>();

    const finalRoutes: RouteObject[] = routes.map((route) => ({
        path: route.path,
        element: <DefaultLayout>{route.element}</DefaultLayout>,
        loader: route.loader || undefined, // Loader varsa, mevcut değilse undefined
        action: route.action || undefined, // Action varsa, mevcut değilse undefined
        errorElement: <ErrorPage />,
    }));

    const authRoute: RouteObject[] = authRoutes.map((route) => ({
        path: route.path,
        element: <>{route.element}</>,
        loader: route.loader || undefined, // Loader varsa, mevcut değilse undefined
        action: route.action || undefined, // Action varsa, mevcut değilse undefined
        errorElement: <ErrorPage />,
    }));

    useEffect(() => {
        const listenToAuthChanges = onAuthStateChanged(auth, async (currentUser) => {
             if (currentUser) {
                 setUser(currentUser);
                 const userRef = doc(db, 'user', currentUser.uid);
                 getDoc(userRef).then((doc) => {
                     if (doc.exists()) {
                         localStorage.setItem("user", JSON.stringify(currentUser));
                         // console.log(doc.data())
                     } else {
                         console.log('user yok');
                         localStorage.removeItem("user");
                         //navigate("/error")
                     }
                 });
                 setLoading(false);
             } else {
               setLoading(false);
             }
             try {
               listenToAuthChanges();
             } catch (error) {
                 console.log('hata');
             }
         });
       }, [user]);

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
        appDispatch(listenToAuthChanges());
    }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);

    const routesToUse = user ? finalRoutes : authRoute;

    // Tek bir router nesnesi oluşturuyoruz
    const router = createBrowserRouter(routesToUse)

    console.log("user",user)

    return (
        <div
            className={`${(store.getState().themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${
                themeConfig.rtlClass
            } main-section antialiased relative font-nunito text-sm font-normal`}
        >
            {loading ? <LoadingPage /> : <RouterProvider router={router} />}
        </div>
    );
}

export default App;
