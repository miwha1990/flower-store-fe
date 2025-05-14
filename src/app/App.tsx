import { BrowserRouter } from 'react-router';

import AppRoutes from './AppRoutes';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useUser, UserContext } from './useUser';
import { create } from 'zustand'
import {AppState, AppStateI} from './store';

export const useAppStore = create<AppStateI>()(AppState)
// Create a client
const queryClient = new QueryClient();

export default function App() {
  const value = useUser();

  return (
    <NotificationsProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserContext.Provider value={value}>
            <ThemeProvider theme={theme} noSsr defaultMode="dark">
              <StyledEngineProvider injectFirst>
                <CssBaseline />
                <AppRoutes />
              </StyledEngineProvider>
            </ThemeProvider>
          </UserContext.Provider>
        </BrowserRouter>
      </QueryClientProvider>
    </NotificationsProvider>
  );
}
