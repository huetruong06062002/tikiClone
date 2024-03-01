import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import ContactPage from "./pages/contact";


import { Outlet } from "react-router-dom";
import Header from "./components/Header/index.jsx";
import Footer from "./components/Footer/index.jsx";
import Home from "./components/Home/index.jsx";
import RegisterPage from "./pages/register/index.jsx";
import "./App.scss";
import { callFetchAccount } from "./services/api.js";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice.js";
import Loading from "./components/Loading/index.jsx";
import NotFound from './components/NotFound/index.jsx';
import AdminPage from './pages/admin/index.jsx';
import ProtectedRoute from './components/ProtectedRoute/index.jsx';
import LayoutAdmin from './components/Admin/LayoutAdmin.jsx';
import './styles/reset.scss';
import UserTable from './components/Admin/User/UserTable.jsx';
import BookTable from './components/Admin/Book/BookTable.jsx';
import BookPage from './pages/book/index.jsx';

const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};




export default function App() {
  const dispatch = useDispatch();
  const isloading = useSelector((state) => state.account.isLoading);

  const getAccount = async () => {
    if(window.location.pathname === '/login'
    || window.location.pathname === '/register'
    ) return
    const res = await callFetchAccount();
    // console.log(">>>check res:", res);
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound/>,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound/>,
      children: [ 
        { index: true, element: <ProtectedRoute><AdminPage /></ProtectedRoute>},
        {
          path: "user",
          element: <UserTable />,
        },
        {
          path: "book",
          element: <BookTable />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      {isloading === false
      || window.location.pathname === '/login' 
      || window.location.pathname === '/register' 
      || window.location.pathname === '/'
      ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
