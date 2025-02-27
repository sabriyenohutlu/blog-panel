import { lazy } from 'react';
import NovelReviewPage from '../pages/NovelReviewPage';
import ContentManagement from '../components/ContentManagement/ContentManagement';
import UserManagement from '../components/UserManagement/UserManagement';
import AddNovelReviewPage from '../pages/AddNovelReviewPage';
import AddNovelRecommendationPage from '../pages/AddNovelRecommendationPage';
import AddNovelSummaryPage from '../pages/AddNovelSummaryPage';
import NovelRecommendationPage from '../pages/NovelRecommendationPage';
import NovelSummaryPage from '../pages/NovelSummaryPage';
import UpdateNovelReviewPage from '../pages/UpdateNovelReviewPage';
import NovelReviewDetailPage from '../pages/NovelReviewDetailPage';
import NovelRecommendationDetailPage from '../pages/NovelRecommendationDetailPage';
import AddStoryPage from '../pages/AddStoryPage';
import StoryPage from '../pages/StoryPage';
import StoryDetailPage from '../pages/StoryDetailPage';
import PoetryPage from '../pages/PoetryPage';
import PoetryDetailPage from "../pages/PoetryDetailPage";
import AddPoetryPage from '../pages/AddPoetryPage';
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
        path: '/icerik-yonetimi/roman/roman-incelemesi-guncelle/:novel_reviewId',
        element: <UpdateNovelReviewPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman/roman-incelemesi-detay/:novel_reviewId',
        element: <NovelReviewDetailPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman/roman-onerisi-ekle',
        element: <AddNovelRecommendationPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman/roman-onerisi-detay/:novel_recId',
        element: <NovelRecommendationDetailPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman/roman-ozeti-ekle',
        element: <AddNovelSummaryPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman/roman-ozetleri',
        element: <NovelSummaryPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/roman/roman-onerileri',
        element: <NovelRecommendationPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/hikaye/hikaye-ekle',
        element: <AddStoryPage />,
        layout: 'defalut',
    },
    {
        path: '/icerik-yonetimi/hikaye/hikayeler',
        element: <StoryPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/hikaye/hikaye-detay/:story_id',
        element: <StoryDetailPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/siir/siirler',
        element: <PoetryPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/siir/siir-ekle',
        element: <AddPoetryPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/siir/siir-detay/:poetry_id',
        element: <PoetryDetailPage />,
        layout: 'default',
    },
];

export { routes };
