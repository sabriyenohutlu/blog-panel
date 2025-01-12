import path from 'path';
import { lazy } from 'react';
import NovelReviewPage from '../pages/NovelReviewPage';
import AddNovelReviewPage from '../pages/AddNovelReviewPage';
import NovelTable from '../components/Novel/NovelTable/NovelTable';
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
    },
    {
        path: '/roman',
        element:<NovelTable/>,
        layout: 'default',
    }

];

export { routes };
