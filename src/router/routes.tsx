import { lazy } from 'react';
import NovelReviewPage from '../pages/NovelReviewPage';
import ContentManagement from '../components/ContentManagement/ContentManagement';
import UserManagement from '../components/UserManagement/UserManagement';
import AddNovelReviewPage from '../pages/AddNovelReviewPage';
import AddNovelRecommendationPage from '../pages/AddNovelRecommendationPage';
import AddNovelSummaryPage from '../pages/AddNovelSummaryPage';
import NovelRecommendationPage from "../pages/NovelRecommendationPage"
import NovelSummaryPage from '../pages/NovelSummaryPage';
import UpdateNovelReviewPage from '../pages/UpdateNovelReviewPage';

const Index = lazy(() => import('../pages/Index'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi',
        element: <ContentManagement />,
        layout: 'default',
    },
    {
        path: '/kullanici-yonetimi',
        element: <UserManagement />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman',
        element: <NovelReviewPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman/roman-incelemeleri',
        element: <NovelReviewPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman/roman-incelemesi-ekle',
        element: <AddNovelReviewPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman/roman-incelemesi-guncelle-:novel_reviewId',
        element: <UpdateNovelReviewPage />,
        layout: 'default',
    },
    {
        path:"/icerik-yonetimi/roman/roman-onerisi-ekle",
        element:<AddNovelRecommendationPage/>,
        layout:"default"
    },
    {
        path:"/icerik-yonetimi/roman/roman-ozeti-ekle",
        element:<AddNovelSummaryPage/>,
        layout:"default"
    },
    {
        path:"/icerik-yonetimi/roman/roman-ozetleri",
        element:<NovelSummaryPage/>,
        layout:"default"
    },
    {
        path:"/icerik-yonetimi/roman/roman-onerileri",
        element:<NovelRecommendationPage/>,
        layout:"default"
    }
];

export { routes };
