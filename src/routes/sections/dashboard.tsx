import { Suspense, lazy } from 'react';

// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { Outlet } from 'react-router-dom';
import { ServiceNewView } from 'src/sections/service/view';
// hooks
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

// OVERVIEW
export const DashboardPage = lazy(() => import('src/pages/dashboard/app'));
export const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const StattisticalReportPage = lazy(() => import('src/pages/dashboard/statistical-report'));
const OverviewManagementPage = lazy(() => import('src/pages/dashboard/management'));
const LocationManagementPage = lazy(() => import('src/pages/dashboard/location'));
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
const ServiceBookingListView = lazy(() => import('src/pages/dashboard/order-booking/list-service'));
const OrderBookingDetailsPage = lazy(() => import('src/pages/dashboard/order-booking/details'));
const OrderBookingEditPage = lazy(() => import('src/pages/dashboard/order-booking/edit'));
const ServiceBookingEditPage = lazy(() => import('src/pages/dashboard/order-booking/edit-service'));

// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
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
const ListEditEmployeePage = lazy(() => import('src/pages/dashboard/create-employee/edit'));

const EmployeeAccountPage = lazy(() => import('src/pages/dashboard/account/account'));

// FICILITIES
const OverviewFicilitiesPage = lazy(() => import('src/pages/dashboard/facilities'));

// Khu vực
const KhuVucListsPage = lazy(() => import('src/pages/dashboard/khuvuc/list'));
const KhuVucNewPage = lazy(() => import('src/pages/dashboard/khuvuc/new'));
const KhuvucEditPage = lazy(() => import('src/pages/dashboard/khuvuc/edit'));

// Tang
const TangListsPage = lazy(() => import('src/pages/dashboard/tang/list'));
const TangNewPage = lazy(() => import('src/pages/dashboard/tang/new'));

// Hạng mục
const HangMucListsPage = lazy(() => import('src/pages/dashboard/hangmuc/list'));
const HangMucNewPage = lazy(() => import('src/pages/dashboard/hangmuc/new'));
const HangMucEditPage = lazy(() => import('src/pages/dashboard/hangmuc/edit'));

// Ca lam viec
const CalvListsPage = lazy(() => import('src/pages/dashboard/calv/list'));
const CalvNewPage = lazy(() => import('src/pages/dashboard/calv/new'));
const CalvEditPage = lazy(() => import('src/pages/dashboard/calv/edit'));

// Giam sat
const ChukyDuanListsPage = lazy(() => import('src/pages/dashboard/chukyduan/list'));
const ChukyDuanNewPage = lazy(() => import('src/pages/dashboard/chukyduan/new'));
const ChukyDuanEditPage = lazy(() => import('src/pages/dashboard/chukyduan/edit'));

// Sự cố
const SuCoListsPage = lazy(() => import('src/pages/dashboard/sucongoai/list'));

// Phân quyền checklist
const QuanlyCaHangMucListsPage = lazy(() => import('src/pages/dashboard/phanquyenchecklist/list'));
const QuanlyCaHangMucNewPage  = lazy(() => import('src/pages/dashboard/phanquyenchecklist/new'));
const QuanlyCaHangMucEditPage = lazy(() => import('src/pages/dashboard/phanquyenchecklist/edit'));

// Dự án
const DuanListsPage = lazy(() => import('src/pages/dashboard/duan/list'));
const DuanNewPage = lazy(() => import('src/pages/dashboard/duan/new'));
const DuanEditPage = lazy(() => import('src/pages/dashboard/duan/edit'));

// Tòa nhà
const ToanhaListsPage = lazy(() => import('src/pages/dashboard/toanha/list'));
const ToanhaNewPage = lazy(() => import('src/pages/dashboard/toanha/new'));
const ToanhaEditPage = lazy(() => import('src/pages/dashboard/toanha/edit'));

// Checklist
const CheckListListsPage = lazy(() => import('src/pages/dashboard/checklist/list'));
const TCheckListListsPage = lazy(() => import('src/pages/dashboard/checklist/tlist'));
const CheckListNewPage = lazy(() => import('src/pages/dashboard/checklist/new'));
const CheckListEditPage = lazy(() => import('src/pages/dashboard/checklist/edit'));
const CaChecklistDetailPage = lazy(() => import('src/pages/dashboard/checklist/detail'));

const UserAdminProfilePage = lazy(() => import('src/pages/dashboard/userAdmin/profile'));
// -----------------------------------------

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
      { element:  <OverviewAnalyticsPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'statistical-report', element: <StattisticalReportPage /> },
      { path: 'management', element: <OverviewManagementPage /> },
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
          { path: 'new', element: <TypeRoomEditPage /> },
        ],
      },
      {
        path: 'type-service',
        children: [
          { element: <TypeServiceListPage />, index: true },
          { path: 'list', element: <TypeServiceListPage /> },
          { path: ':id/edit', element: <TypeServiceEditPage /> },
          { path: 'new', element: <TypeServiceEditPage /> },
        ],
      },
      {
        path: 'service',
        children: [
          { element: <ServiceListPage />, index: true },
          { path: 'list', element: <ServiceListPage /> },
          { path: ':id/edit', element: <ServiceEditPage /> },
          { path: 'new', element: <ServiceNewView /> },
        ],
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
        path: 'khuvuc',
        children: [
          { element: <KhuVucListsPage />, index: true },
          { path: 'list', element: <KhuVucListsPage /> },
          { path: ':id/edit', element: <KhuvucEditPage /> },
          { path: 'new', element: <KhuVucNewPage /> },
        ],
      },
      {
        path: 'chu-ky-du-an',
        children: [
          { element: <ChukyDuanListsPage />, index: true },
          { path: 'list', element: <ChukyDuanListsPage /> },
          { path: ':id/edit', element: <ChukyDuanEditPage /> },
          { path: 'new', element: <ChukyDuanNewPage /> },
        ],
      },
      { path: 'quan-ly-vi-tri', element: <LocationManagementPage /> },
      {
        path: 'hangmuc',
        children: [
          { element: <HangMucListsPage />, index: true },
          { path: 'list', element: <HangMucListsPage /> },
          { path: ':id/edit', element: <HangMucEditPage /> },
          { path: 'new', element: <HangMucNewPage /> },
        ],
      },
      {
        path: 'calv',
        children: [
          { element: <CalvListsPage />, index: true },
          { path: 'list', element: <CalvListsPage /> },
          { path: ':id/edit', element: <CalvEditPage /> },
          { path: 'new', element: <CalvNewPage /> },
        ],
      },
      {
        path: 'phan-ca-hang-muc',
        children: [
          { element: <QuanlyCaHangMucListsPage />, index: true },
          { path: 'new', element: <QuanlyCaHangMucNewPage /> },
          { path: 'list', element: <QuanlyCaHangMucListsPage /> },
          { path: ':id/edit', element: <QuanlyCaHangMucEditPage /> },
        ],
      },
      {
        path: 'checklist',
        children: [
          { element: <CheckListListsPage />, index: true },
          { path: 'list', element: <CheckListListsPage /> },
          { path: ':id/edit', element: <CheckListEditPage /> },
          { path: 'lists/:id', element: <CaChecklistDetailPage /> },
          { path: 'new', element: <CheckListNewPage /> },
          { path: 'lists', element: <TCheckListListsPage /> },
        ],
      },
      {
        path: 'toanha',
        children: [
          { element: <ToanhaListsPage />, index: true },
          { path: 'list', element: <ToanhaListsPage /> },
          { path: ':id/edit', element: <ToanhaEditPage /> },
          { path: 'new', element: <ToanhaNewPage /> },
        ],
      },
      {
        path: 'tang',
        children: [
          { element: <TangListsPage />, index: true },
          { path: 'list', element: <TangListsPage /> },
          { path: 'new', element: <TangNewPage /> },
        ],
      },
      {
        path: 'duan',
        children: [
          { element: <DuanListsPage />, index: true },
          { path: 'list', element: <DuanListsPage /> },
          { path: ':id/edit', element: <DuanEditPage /> },
          { path: 'new', element: <DuanNewPage /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <UserAdminProfilePage />, index: true },
          { path: 'profile', element: <UserAdminProfilePage /> },
        ],
      },
      {
        path: 'su-co-ngoai',
        children: [
          { element: <SuCoListsPage />, index: true },
          { path: 'list', element: <SuCoListsPage /> },
        ],
      },
      {
        path: 'order-booking',
        children: [
          { element: <OrderBookingListPage />, index: true },
          { path: 'services', element: <ServiceBookingListView /> },
          { path: ':id', element: <OrderBookingDetailsPage /> },
          { path: ':id/edit', element: <OrderBookingEditPage /> },
          { path: 'services/:id/edit', element: <ServiceBookingEditPage /> },
          { path: 'services/:id', element: <OrderBookingEditPage /> },
          // { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'account-employee',
        children: [{ element: <EmployeeAccountPage />, index: true }],
      },
      {
        path: 'create-user',
        children: [
          { element: <CreateEmployeePage />, index: true },
          { path: 'list', element: <ListEmployeePage /> },
          { path: ':id/edit', element: <ListEditEmployeePage /> },
        ],
      },
      
      {
        path: 'userMinimal',
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
          // { path: ':id', element: <OrderDetailsPage /> },
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
