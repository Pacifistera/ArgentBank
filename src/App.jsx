import { Outlet } from 'react-router';
import { createHashRouter, RouterProvider } from 'react-router';
import Header from './components/header';
import Footer from './components/footer';
import Index from './page/index';
import SignIn from './page/sign-in';
import User from './page/user';
import './styles/main.css';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <p>Error</p>,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/user',
        element: <User />,
      },
    ],
  },
]);

function Layout() {
  return (
    <>
      <Header />
      <Outlet context={{ mainClass: 'main' }} />
      <Footer />
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
