import logo from './logo.svg';
import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import React from 'react';
import { LandingPage } from './pages/user/landingPage';
import Footer from './components/user/footer';
import { GetStarted } from './pages/user/getStarted';
import { LoginPage } from './pages/user/loginPage';
import { NotFound } from './pages/user/notFound';
import { ForgotPasswordPage } from './pages/user/forgotPassword';
import { AllProductsPage } from './pages/supplier/allProductsPage';
import { ProductDetails } from './pages/supplier/productDetails';
import { MyCart } from './pages/buyer/myCart';
import { Profile } from './pages/user/profile';
import { ShoppPayButton } from './utils/shoppPayButton';
import { CreateShoppPay } from './components/buyer/createShoppPayAccount';
import { OrderStatusPage } from './pages/buyer/orderStatusPage';
import { TopUp } from './pages/buyer/topUp';
import { UploadProductPage } from './pages/supplier/uploadProductsPage';
import { EditProductForm } from './components/supplier/editProductForm';
import { EditProductPage } from './pages/supplier/editProductPage';
import { MyProductsPage } from './pages/supplier/myProductsPage';
import { BuyerEditProfilePage } from './pages/buyer/buyerEditProfile';
import { SupplierEditProfilePage } from './pages/supplier/supplierEditProfile';
import { ManageUsers } from './pages/admin/manageUsers';
import { ManageProducts } from './pages/admin/manageProducts';
import { ManageOrders } from './pages/admin/manageOrders';
import { EditProductAdminPage } from './pages/admin/editProductAdminPage';
import { PublicStore } from './components/user/publicStoreComp';
import { ReviewProduct } from './pages/buyer/reviewProduct';
import { SendVoucher } from './pages/admin/sendVouchers';
import { AdminVoucherForm } from './components/admin/adminVoucherForm';
import { ContactUs } from './pages/user/contactUs';
import { AllReports } from './pages/admin/allReports';
import { AboutUs } from './pages/user/aboutUs';



function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />}/>
        <Route path='/*' element={<NotFound />}/>
        <Route path='/getStarted' element={<GetStarted />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/forgotPassword' element={<ForgotPasswordPage />}/>
        <Route path='/dashboard' element={<AllProductsPage />}/>
        <Route path='/contact-us' element={<ContactUs />}/>
        <Route path='/about-us' element={<AboutUs />}/>
        <Route path='/myCart' element={<MyCart />}/>
        <Route path='/myOrders' element={<OrderStatusPage />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/createShoppPay' element={<CreateShoppPay />}/>
        <Route path='/newProduct' element={<UploadProductPage />}/>
        <Route path='/myProducts' element={<MyProductsPage />}/>
        <Route path='/topUp' element={<TopUp />}/>
        <Route path='/editProfileBuyer' element={<BuyerEditProfilePage />}/>
        <Route path='/editProfileSupplier' element={<SupplierEditProfilePage />}/>
        <Route path='/productDetails/:productId' element={<ProductDetails />}/>
        <Route path='/store/:supplierEmail' element={<PublicStore />}/>
        <Route path='/shoppPay/:orderId' element={<ShoppPayButton />}/>
        <Route path='/editProduct/:productId' element={<EditProductPage />}/>
        <Route path='/review/productDetails/:productId' element={<ProductDetails />}/>
        <Route path='/review/:productId' element={<ReviewProduct />}/>
        <Route path='/editProduct/admin/:productId' element={<EditProductAdminPage />}/>
        <Route path='/manageUsers' element={<ManageUsers />}/>
        <Route path='/addVoucher/:userEmail' element={<AdminVoucherForm />}/>
        <Route path='/sendVouchers' element={<SendVoucher />}/>
        <Route path='/manageProducts' element={<ManageProducts />}/>
        <Route path='/manageOrders' element={<ManageOrders />}/>
        <Route path='/allReports' element={<AllReports />}/>

      </Routes>
    <Footer />
  

    </>
  );
}

export default App;
