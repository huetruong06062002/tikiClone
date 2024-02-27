import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import ContactPage from "./pages/contact";
import BookPage from "./pages/book/index.jsx";
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

const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

/*
  HomePage (show all products)
  product detail page
  checkout page
  3 pages này dùng chung 2 components header và footer


  login/register page
  admin page...
*/
export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  const getAccount = async () => {
    if(window.location.pathname === '/login'  || window.location.pathname === '/login') return
    const res = await callFetchAccount();
    // console.log(">>>check res:", res);
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data.user));
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
          path: "book",
          element: <BookPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <Layout />,
      errorElement: <NotFound/>,
      children: [
        { index: true, element: <ProtectedRoute><AdminPage /></ProtectedRoute>},
        {
          path: "user",
          element: <ContactPage />,
        },
        {
          path: "book",
          element: <BookPage />,
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
      {isAuthenticated === true
      || window.location.pathname === '/login' 
      || window.location.pathname === '/admin' 
      ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
