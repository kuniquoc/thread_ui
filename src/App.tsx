import Navigation from './components/Navigation';
import { Outlet } from 'react-router-dom';
import { useNoNavigation } from './hooks/useNoNavigation';
import { PusherProvider } from './hooks/usePusherContext';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './components/common/ToastManager';
import { usePusher } from './hooks/usePusher';
import { useToast } from './components/common/ToastManager';
import { useUser } from './hooks/useUser';
import { useEffect, useCallback } from 'react';
import { useNotificationChannel } from './hooks/useNotificationChannel';
import { useNotification } from './hooks/useNotification';

function AppContent() {
  const noNavigation = useNoNavigation();
  const { addToast } = useToast();
  const { user, getCurrentUser } = useUser();
  const { getUnreadNotifications } = useNotification();

  const handlePusherEvent = useCallback((data: any) => {
    console.log('📨 Received Pusher event:', data);

    if (data.type === 'new_notification') {
      console.log('🔔 Showing notification:', data.content);
      addToast(data.content);
      // Refresh unread notifications when receiving new one
      getUnreadNotifications();
    }
  }, [addToast, getUnreadNotifications]);

  useEffect(() => {
    if (!user) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  // Subscribe to user's personal notification channel
  usePusher(user ? `user_${user.id}` : '', handlePusherEvent);

  // Subscribe to user's notification channel
  useNotificationChannel(() => {
    // Refresh unread notifications when receiving new one
    getUnreadNotifications();
  });

  return (
    <div>
      <ScrollToTop />
      {!noNavigation && <Navigation />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <PusherProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </PusherProvider>
  );
}

export default App;