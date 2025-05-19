import Navigation from './components/Navigation';
import { Outlet } from 'react-router-dom';
import { useNoNavigation } from './hooks/useNoNavigation';
import { PusherProvider } from './hooks/usePusherContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const noNavigation = useNoNavigation();

  return (
    <PusherProvider>
      <div>
        <ScrollToTop />
        {!noNavigation && <Navigation />}
        <main>
          <Outlet />
        </main>
      </div>
    </PusherProvider>
  );
}

export default App;