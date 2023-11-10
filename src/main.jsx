import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root.jsx';
import ErrorPage from './Error-Page.jsx';
import Home from './components/Home/Home';
import Article from './components/Article/Article';
import Category from './components/Category/Category';
import CreateArticle from './components/Forms/CreateArticle';
import UpdateArticle from './components/Forms/UpdateArticle';
import User from './components/User/User';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            {
                path: '/Blog-World-React-App/Category/:id',
                element: <Category />,
            },
            {
                path: '/Blog-World-React-App/Article/create',
                element: <CreateArticle />,
            },
            {
                path: '/Blog-World-React-App/Article/:id/update',
                element: <UpdateArticle />,
            },
            {
                path: '/Blog-World-React-App/Article/:id',
                element: <Article />,
            },
            {
                path: '/Blog-World-React-App/User/:id',
                element: <User />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
