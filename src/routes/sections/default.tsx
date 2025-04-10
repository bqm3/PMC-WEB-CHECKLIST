import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import MainLayout from 'src/layouts/main';
import SimpleLayout from 'src/layouts/simple';
import CompactLayout from 'src/layouts/compact';
// components
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));
const FaqsPage = lazy(() => import('src/pages/faqs'));
const AboutPage = lazy(() => import('src/pages/about-us'));
const GptPage = lazy(() => import('src/pages/gpt'));
const ContactPage = lazy(() => import('src/pages/contact-us'));
const PricingPage = lazy(() => import('src/pages/pricing'));
const PaymentPage = lazy(() => import('src/pages/payment'));
const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));
const MaintenancePage = lazy(() => import('src/pages/maintenance'));
// PRODUCT
const ProductListPage = lazy(() => import('src/pages/product/list'));
const ProductDetailsPage = lazy(() => import('src/pages/product/details'));
const ProductCheckoutPage = lazy(() => import('src/pages/product/checkout'));
// BLOG
const PostListPage = lazy(() => import('src/pages/post/list'));
const PostDetailsPage = lazy(() => import('src/pages/post/details'));

// ----------------------------------------------------------------------

export const defaultRoutes = [
    {
        element: (
            <SimpleLayout>
                <Suspense fallback={<SplashScreen />}>
                    <Outlet />
                </Suspense>
            </SimpleLayout>
        ),
        children: [
            { path: 'gptprivacypolicy', element: <GptPage /> },
        ],
    },

    {
        element: (
            <CompactLayout>
                <Suspense fallback={<SplashScreen />}>
                    <Outlet />
                </Suspense>
            </CompactLayout>
        ),
        children: [
            { path: '500', element: <Page500 /> },
            { path: '404', element: <Page404 /> },
            { path: '403', element: <Page403 /> },
        ],
    },
];
