import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomeScreen } from './components/home/HomeScreen';
import { ModeScreen } from './components/mode/ModeScreen';
import { PhotoPreview } from './components/photo/PhotoPreview';
import { PhotoScreen } from './components/photo/PhotoScreen';
import { ResultScreen } from './components/result/ResultScreen';

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
