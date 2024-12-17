import path from 'path';
import { lazy } from 'react';
import NovelReviewPage from '../pages/NovelReviewPage';
import AddNovelReviewPage from '../pages/AddNovelReviewPage';
const Index = lazy(() => import('../pages/Index'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path:"/roman-incelemeleri",
        element:<NovelReviewPage/>,
        layout:"default"
    },
    { 
        path:"/roman-incelemesi-ekle",
        element:<AddNovelReviewPage/>,
        layout:"default"
    }

];

export { routes };
