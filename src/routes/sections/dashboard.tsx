import { Suspense, lazy } from 'react';

// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { Outlet } from 'react-router-dom';
import { ServiceNewView } from 'src/sections/service/view';

// ----------------------------------------------------------------------

// OVERVIEW
export const DashboardPage = lazy(() => import('src/pages/dashboard/app'));
export const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// TYPE ROOM
const TypeRoomListPage = lazy(() => import('src/pages/dashboard/type-room/list'));
const TypeRoomEditPage = lazy(() => import('src/pages/dashboard/type-room/edit'));
// TYPE SERVICE
const TypeServiceListPage = lazy(() => import('src/pages/dashboard/type-service/list'));
const TypeServiceEditPage = lazy(() => import('src/pages/dashboard/type-service/edit'));
// SERVICE
const ServiceListPage = lazy(() => import('src/pages/dashboard/service/list'));
const ServiceEditPage = lazy(() => import('src/pages/dashboard/service/edit'));
// ROOM
const RoomListsPage = lazy(() => import('src/pages/dashboard/room/list'));
const RoomDetailPage = lazy(() => import('src/pages/dashboard/room/details'));
const RoomNewPage = lazy(() => import('src/pages/dashboard/room/new'));
const RoomEditPage = lazy(() => import('src/pages/dashboard/room/edit'));
// ORDER BOOKING

const OrderBookingListPage = lazy(() => import('src/pages/dashboard/order-booking/list'));
const OrderBookingDetailsPage = lazy(() => import('src/pages/dashboard/order-booking/details'));
const OrderBookingEditPage = lazy(() => import('src/pages/dashboard/order-booking/edit'));

// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
//
const CreateEmployeePage = lazy(() => import('src/pages/dashboard/create-employee/new'));
const ListEmployeePage = lazy(() => import('src/pages/dashboard/create-employee/list'));
const EmployeeAccountPage = lazy(() => import('src/pages/dashboard/account/account'));

// FICILITIES
const OverviewFicilitiesPage = lazy(() => import('src/pages/dashboard/facilities'))
// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <DashboardPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'ficilities', element: <OverviewFicilitiesPage /> },
      {
        path: 'type-room',
        children: [
          { element: <TypeRoomListPage />, index: true },
          { path: 'list', element: <TypeRoomListPage /> },
          { path: ':id/edit', element: <TypeRoomEditPage /> },
          { path: 'new', element: <TypeRoomEditPage /> }
        ]
      },
      {
        path: 'type-service',
        children: [
          { element: <TypeServiceListPage />, index: true },
          { path: 'list', element: <TypeServiceListPage /> },
          { path: ':id/edit', element: <TypeServiceEditPage /> },
          { path: 'new', element: <TypeServiceEditPage /> }
        ]
      },
      {
        path: 'service',
        children: [
          { element: <ServiceListPage />, index: true },
          { path: 'list', element: <ServiceListPage /> },
          { path: ':id/edit', element: <ServiceEditPage /> },
          { path: 'new', element: <ServiceNewView /> }
        ]
      },
      {
        path: 'room',
        children: [
          { element: <RoomListsPage />, index: true },
          { path: 'list', element: <RoomListsPage /> },
          { path: ':id', element: <RoomDetailPage /> },
          { path: ':id/edit', element: <RoomEditPage /> },
          { path: 'new', element: <RoomNewPage /> },

        ],
      },
      {
        path: 'order-booking',
        children: [
          { element: <OrderBookingListPage />, index: true },
          { path: 'list', element: <OrderBookingListPage /> },
          { path: ':id', element: <OrderBookingDetailsPage /> },
          { path: ':id/edit', element: <OrderBookingEditPage /> },
          // { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'account-employee',
        children: [
          { element: <EmployeeAccountPage />, index: true },
        ],
      },
      {
        path: 'create-employee',
        children: [
          { element: <CreateEmployeePage />, index: true },
          { path: 'list', element: <ListEmployeePage /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
