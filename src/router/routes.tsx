import { lazy } from 'react';
import NovelReviewPage from '../pages/NovelReviewPage';
import ContentManagement from '../components/ContentManagement/ContentManagement';
import UserManagement from '../components/UserManagement/UserManagement';
import NovelReviewTable from '../components/Novel/NovelReview/NovelReviewTable';
import AddNovelReview from '../components/Novel/NovelReview/AddNovelReview';

const Index = lazy(() => import('../pages/Index'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/icerik-yönetimi',
        element: <ContentManagement />,
        layout: 'default',
    },
    {
        path: '/kullanici-yonetimi',
        element: <UserManagement />,
        layout: 'default',
    },
    {
        path: '/icerik-yönetimi/roman',
        element: <NovelReviewPage />,
        layout: 'default',
    },
    {
        path: '/icerik-yönetimi/roman/roman-incelemeleri',
        element: <NovelReviewTable />,
        layout: 'default',
    },
    {
        path: '/icerik-yönetimi/roman/roman-incelemesi-ekle',
        element: <AddNovelReview />,
        layout: 'default',
    }
];

export { routes };
