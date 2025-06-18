import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';

// 租房业务页面
import RentalDashboard from './pages/rental/Dashboard';
import RentalRoomStatus from './pages/rental/RoomStatus/index';
import RentalRoomDetail from './pages/rental/RoomStatus/RoomDetail';
import RentalProperties from './pages/rental/Properties';
import RentalPropertyDetail from './pages/rental/PropertyDetail';
import RentalPropertyEdit from './pages/rental/PropertyEdit';
import RentalPromotionCenter from './pages/rental/PromotionCenter';
import RentalCampaignCreate from './pages/rental/PromotionCenter/CampaignCreate';
import RentalCampaignEdit from './pages/rental/PromotionCenter/CampaignEdit';
import RentalCampaignDetail from './pages/rental/PromotionCenter/CampaignDetail';
import RentalCampaignAnalytics from './pages/rental/PromotionCenter/CampaignAnalytics';
import RentalConsultations from './pages/rental/Consultations';
import RentalChatDetail from './pages/rental/ChatDetail';
import RentalTenants from './pages/rental/Tenants';
import RentalTenantDetail from './pages/rental/TenantDetail';
import RentalTenantEdit from './pages/rental/TenantEdit';
import RentalAppointments from './pages/rental/Appointments';
import RentalMarketingAnalytics from './pages/rental/MarketingAnalytics';
import RentalPropertyMarketingDetail from './pages/rental/PropertyMarketingDetail';
import RentalSettings from './pages/rental/Settings';

// 酒店业务页面
import HotelDashboard from './pages/hotel/Dashboard';
import HotelOrderManagement from './pages/hotel/OrderManagement';
import HotelOrderStatistics from './pages/hotel/OrderStatistics';
import HotelRoomStatusManagement from './pages/hotel/RoomStatusManagement';
import HotelBatchRoomStatus from './pages/hotel/BatchRoomStatus';
import HotelPriceCalendar from './pages/hotel/PriceCalendar';
import SalesProducts from './pages/hotel/SalesProducts';
import PriceSettings from './pages/hotel/PriceSettings';
import HotelBasicInfoManagement from './pages/hotel/BasicInfoManagement';
import HotelRoomManagement from './pages/hotel/RoomManagement';
import HotelAddRoomType from './pages/hotel/AddRoomType';
import HotelRoomDetail from './pages/hotel/RoomDetail';
import HotelImageManagement from './pages/hotel/ImageManagement';
import HotelPolicyManagement from './pages/hotel/PolicyManagement';
import HotelFacilityManagement from './pages/hotel/FacilityManagement';
import HotelReviewList from './pages/hotel/ReviewList';
import HotelReviewSettings from './pages/hotel/ReviewSettings';
import HotelBillManagement from './pages/hotel/BillManagement';
import HotelBillDetail from './pages/hotel/BillDetail';
import HotelInvoiceManagement from './pages/hotel/InvoiceManagement';
import HotelRevenueReport from './pages/hotel/RevenueReport';
import HotelMarketingManagement from './pages/hotel/MarketingManagement';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 认证路由 */}
        <Route path="/auth/*" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
        </Route>

        {/* 租房商家路由 */}
        <Route path="/rental/*" element={<MainLayout businessType="rental" />}>
          <Route index element={<Navigate to="/rental/dashboard" replace />} />
          <Route path="dashboard" element={<RentalDashboard />} />
          <Route path="room-status" element={<RentalRoomStatus />} />
          <Route path="room-status/detail/:roomId" element={<RentalRoomDetail />} />
          <Route path="property" element={<RentalProperties />} />
          <Route path="property/detail/:id" element={<RentalPropertyDetail />} />
          <Route path="property/edit/:id" element={<RentalPropertyEdit />} />
          <Route path="property/add" element={<RentalPropertyEdit />} />
          <Route path="promotion" element={<RentalPromotionCenter />}>
            <Route path="create" element={<RentalCampaignCreate />} />
            <Route path="edit/:id" element={<RentalCampaignEdit />} />
            <Route path="detail/:id" element={<RentalCampaignDetail />} />
            <Route path="analytics/:id" element={<RentalCampaignAnalytics />} />
          </Route>
          <Route path="consultation" element={<RentalConsultations />} />
          <Route path="consultation/chat/:id" element={<RentalChatDetail />} />
          <Route path="appointment" element={<RentalAppointments />} />
          <Route path="appointment/detail/:id" element={<RentalAppointments />} />
          <Route path="tenant" element={<RentalTenants />} />
          <Route path="tenant/detail/:id" element={<RentalTenantDetail />} />
          <Route path="tenant/edit/:id" element={<RentalTenantEdit />} />
          <Route path="marketing-analytics" element={<RentalMarketingAnalytics />} />
          <Route path="marketing-analytics/property/:id" element={<RentalPropertyMarketingDetail />} />
          <Route path="settings" element={<RentalSettings />} />
        </Route>

        {/* 酒店商家路由 */}
        <Route path="/hotel/*" element={<MainLayout businessType="hotel" />}>
          <Route index element={<Navigate to="/hotel/dashboard" replace />} />
          <Route path="dashboard" element={<HotelDashboard />} />
          
          {/* 订单管理 */}
          <Route path="orders" element={<HotelOrderManagement />} />
          <Route path="orders/statistics" element={<HotelOrderStatistics />} />
          
          {/* 房价房态管理 */}
          <Route path="room-status" element={<HotelRoomStatusManagement />} />
          <Route path="batch-room-status" element={<HotelBatchRoomStatus />} />
          <Route path="price-calendar" element={<HotelPriceCalendar />} />
          <Route path="sales-products" element={<SalesProducts />} />
          <Route path="price-settings" element={<PriceSettings />} />
          
          {/* 基础信息管理 */}
          <Route path="basic-info" element={<HotelBasicInfoManagement />} />
          <Route path="room-management" element={<HotelRoomManagement />} />
          <Route path="room-management/add" element={<HotelAddRoomType />} />
          <Route path="room-management/detail/:id" element={<HotelRoomDetail />} />
          <Route path="image-management" element={<HotelImageManagement />} />
          <Route path="policy-management" element={<HotelPolicyManagement />} />
          <Route path="facility-management" element={<HotelFacilityManagement />} />
          
          {/* 评价管理 */}
          <Route path="reviews" element={<HotelReviewList />} />
          <Route path="reviews/settings" element={<HotelReviewSettings />} />
          
          {/* 财务管理 */}
          <Route path="bills" element={<HotelBillManagement />} />
          <Route path="bills/detail/:id" element={<HotelBillDetail />} />
          <Route path="invoices" element={<HotelInvoiceManagement />} />
          
          {/* 营销管理 */}
          <Route path="marketing" element={<HotelMarketingManagement />} />
          
          {/* 营收统计报表 */}
          <Route path="revenue-report" element={<HotelRevenueReport />} />
        </Route>

        {/* 兼容旧的路由 - 重定向到租房业务 */}
        <Route path="/dashboard" element={<Navigate to="/rental/dashboard" replace />} />
        <Route path="/room-status" element={<Navigate to="/rental/room-status" replace />} />
        <Route path="/property" element={<Navigate to="/rental/property" replace />} />
        <Route path="/promotion" element={<Navigate to="/rental/promotion" replace />} />
        <Route path="/consultation" element={<Navigate to="/rental/consultation" replace />} />
        <Route path="/appointment" element={<Navigate to="/rental/appointment" replace />} />
        <Route path="/tenant" element={<Navigate to="/rental/tenant" replace />} />
        <Route path="/settings" element={<Navigate to="/rental/settings" replace />} />

        {/* 默认重定向到登录页 */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App; 