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
import PoetryDetailPage from '../pages/PoetryDetailPage';
import AddPoetryPage from '../pages/AddPoetryPage';
import BiographyPage from '../pages/BiographyPage';
import AddBiographyPage from '../pages/AddBiographyPage';
import AddDailyWordPage from '../pages/AddDailyWordPage';
import DailyWordPage from '../pages/DailyWordPage';
import AddBlogPage from '../pages/AddBlogPage';
import BlogPage from '../pages/BlogPage';
import LoginBoxed from '../pages/Authentication/LoginBoxed';
import RegisterBoxed from '../pages/Authentication/RegisterBoxed';
import UnlockCover from '../pages/Authentication/UnlockCover';
import RecoverIdCover from '../pages/Authentication/RecoverIdCover';
import RecoverIdBox from '../pages/Authentication/RecoverIdBox';
import UnlockBox from '../pages/Authentication/UnlockBox';
import ProfilePage from '../pages/ProfilePage';
import {RouteObject } from 'react-router-dom';
import AddCategoryPage from '../pages/AddCategoryPage';
const Index = lazy(() => import('../pages/Index'));

type RouteConfig = RouteObject & {
    loader?: () => Promise<any>;
    action?: () => void;
};

const authRoutes: RouteConfig[] = [
    {
        path: '/',
        element: <LoginBoxed />
    },
    {
        path: '/auth/boxed-signup',
        element: <RegisterBoxed />
    },
    {
        path: '/auth/boxed-lockscreen',
        element: <UnlockBox />
    },
    {
        path: '/auth/boxed-password-reset',
        element: <RecoverIdBox />
    },
    {
        path: '/auth/cover-lockscreen',
        element: <UnlockCover />
    },
    {
        path: '/auth/cover-password-reset',
        element: <RecoverIdCover />
    },
];

const routes: RouteConfig[] = [
    // dashboard
    {
        path: '/',
        element: <Index />
    },
    {
        path: '/icerik-yonetimi',
        element: <ContentManagement />
    },
    {
        path: '/kullanici-yonetimi',
        element: <UserManagement />
    },
    {
        path: '/icerik-yonetimi/roman',
        element: <NovelReviewPage />
    },
    {
        path: '/icerik-yonetimi/roman/roman-incelemeleri',
        element: <NovelReviewPage />
    },
    {
        path: '/icerik-yonetimi/roman/roman-incelemesi-ekle',
        element: <AddNovelReviewPage />
    },
    {
        path: '/icerik-yonetimi/roman/roman-incelemesi-guncelle/:novel_reviewId',
        element: <UpdateNovelReviewPage />
    },
    {
        path: '/icerik-yonetimi/roman/roman-incelemesi-detay/:novel_reviewId',
        element: <NovelReviewDetailPage />
    },
    {
        path: '/icerik-yonetimi/roman/roman-onerisi-ekle',
        element: <AddNovelRecommendationPage />
    },
    {
        path: '/icerik-yonetimi/roman/roman-onerisi-detay/:novel_recId',
        element: <NovelRecommendationDetailPage />
    },
    {
        path: '/icerik-yonetimi/roman/roman-ozeti-ekle',
        element: <AddNovelSummaryPage />
    },
    {
        path: '/icerik-yonetimi/roman/roman-ozetleri',
        element: <NovelSummaryPage />
    },
    {
        path: '/icerik-yonetimi/roman/roman-onerileri',
        element: <NovelRecommendationPage />
    },
    {
        path: '/icerik-yonetimi/hikaye/hikaye-ekle',
        element: <AddStoryPage />
    },
    {
        path: '/icerik-yonetimi/hikaye/hikayeler',
        element: <StoryPage />
    },
    {
        path: '/icerik-yonetimi/hikaye/hikaye-detay/:story_id',
        element: <StoryDetailPage />
    },
    {
        path: '/icerik-yonetimi/siir/siirler',
        element: <PoetryPage />
    },
    {
        path: '/icerik-yonetimi/siir/siir-ekle',
        element: <AddPoetryPage />
    },
    {
        path: '/icerik-yonetimi/siir/siir-detay/:poetry_id',
        element: <PoetryDetailPage />
    },
    {
        path: '/icerik-yonetimi/biyografi/biyografiler',
        element: <BiographyPage />
    },
    {
        path: '/icerik-yonetimi/biyografi/biyografi-ekle',
        element: <AddBiographyPage />
    },
    {
        path: '/icerik-yonetimi/gunluk-soz/gunluk-soz-ekle',
        element: <AddDailyWordPage />
    },
    {
        path: '/icerik-yonetimi/gunluk-soz/gunluk-sozler',
        element: <DailyWordPage />
    },
    {
        path: '/icerik-yonetimi/blog/blog-yazilari',
        element: <BlogPage />,
    },
    {
        path: '/icerik-yonetimi/blog/blog-yazi-ekle',
        element: <AddBlogPage />
    },

    {
        path: '/kullanici-yonetimi/profil',
        element: <ProfilePage />
    },
    {
        path:"/tanimlamalar/kategori-ekle",
        element:<AddCategoryPage/>
    }
];

export { routes, authRoutes};
