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
    {
        path: '/icerik-yonetimi/biyografi/biyografiler',
        element: <BiographyPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/biyografi/biyografi-ekle',
        element: <AddBiographyPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/gunluk-soz/gunluk-soz-ekle',
        element: <AddDailyWordPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/gunluk-soz/gunluk-sozler',
        element: <DailyWordPage />,
        layout: 'default',
    },
    {
        path: '/icerik*yonetimi/blog/blog-yazilari',
        element: <BlogPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yonetimi/blog/blog-yazi-ekle',
        element: <AddBlogPage />,
        layout: 'default',
    },
    {
        path: '/auth/boxed-signin',
        element: <LoginBoxed />,
        layout: 'blank',
    },
    {
        path: '/auth/boxed-signup',
        element: <RegisterBoxed />,
        layout: 'blank',
    },
    {
        path: '/auth/boxed-lockscreen',
        element: <UnlockBox />,
        layout: 'blank',
    },
    {
        path: '/auth/boxed-password-reset',
        element: <RecoverIdBox />,
        layout: 'blank',
    },
    // {
    //     path: '/auth/cover-login',
    //     element: <LoginCover />,
    //     layout: 'blank',
    // },
    // {
    //     path: '/auth/cover-register',
    //     element: <RegisterCover />,
    //     layout: 'blank',
    // },
    {
        path: '/auth/cover-lockscreen',
        element: <UnlockCover />,
        layout: 'blank',
    },
    {
        path: '/auth/cover-password-reset',
        element: <RecoverIdCover />,
        layout: 'blank',
    },
];

export { routes };
