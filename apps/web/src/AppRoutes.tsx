import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomeScreen } from '@/web/components/home/HomeScreen';
import { ModeScreen } from '@/web/components/mode/ModeScreen';
import { PhotoPreview } from '@/web/components/photo/PhotoPreview';
import { PhotoScreen } from '@/web/components/photo/PhotoScreen';
import { ResultScreen } from '@/web/components/result/ResultScreen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeScreen />,
  },
  {
    path: '/mode',
    element: <ModeScreen />,
  },
  {
    path: '/photo',
    element: <PhotoScreen />,
  },
  {
    path: '/photo/preview',
    element: <PhotoPreview />,
  },
  {
    path: '/result',
    element: <ResultScreen />,
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
