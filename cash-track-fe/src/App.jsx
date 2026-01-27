import { useEffect } from 'react'
import { AuthProvider } from './auth/AuthContext';
import Middleware from './routes/Middleware';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { setNavigate } from './utils/navigator';
import { authRoutes, publicRoutes } from './routes/Routes';
import { createTheme, ThemeProvider } from '@mui/material';

export default function App() {
  function NavigationHandler() {
    const navigate = useNavigate();

    useEffect(() => {
      setNavigate(navigate);
    }, [navigate]);

    return null;
  }


  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <NavigationHandler />
          <Routes>
            {publicRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}

            {authRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <Middleware>
                    {route.element}
                  </Middleware>
                }
              />
            ))}

            <Route path="*" element={<Navigate to="/dashboard" />} />

          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
