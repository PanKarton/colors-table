import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider';
import { SingleColor } from './components/Molecules/SingleColor';
import { DashboardTemplate } from './components/Templates/DashboardTemplate';
import { ColorsTable } from './components/Molecules/ColorsTable';
import { PageNotFoundMessage } from './components/Atoms/PageNotFoundMessage';
import { ModalProvider } from './providers/ModalProvider';

export const pageSize = 5;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/colors/1" replace={true} />,
  },
  {
    path: '/colors/:pageIndex',
    element: (
      <AppProvider>
        <DashboardTemplate>
          <ColorsTable />
        </DashboardTemplate>
      </AppProvider>
    ),
    loader: async ({ params: { pageIndex } }) => {
      try {
        if (!pageIndex) return null;

        const response = await fetch(
          `https://reqres.in/api/products?page=${pageIndex}&per_page=${pageSize}`
        );
        const colorsData = await response.json();

        return {
          colorsData,
        };
      } catch {
        return {
          colorsData: null,
        };
      }
    },
  },
  {
    path: '/color/:colorId',
    element: (
      <ModalProvider>
        <DashboardTemplate>
          <SingleColor />
        </DashboardTemplate>
      </ModalProvider>
    ),
    loader: async ({ params: { colorId } }) => {
      try {
        if (!colorId) return null;

        const response = await fetch(`https://reqres.in/api/products?id=${colorId}`);
        const data = await response.json();

        return {
          colorData: data,
          colorId,
        };
      } catch {
        return {
          colorsData: null,
        };
      }
    },
  },
  {
    path: '*',
    element: <PageNotFoundMessage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
