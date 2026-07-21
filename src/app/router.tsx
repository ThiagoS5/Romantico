import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'

import { OceanLayout } from '@/components/ocean/OceanLayout'
import { ReasonRoute } from '@/components/reasons/ReasonRoute'

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <OceanLayout />,
    children: [
      { index: true, element: null },
      { path: 'motivos/:slug', element: <ReasonRoute /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
