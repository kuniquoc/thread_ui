import Navigation from './components/Navigation';
import { Outlet } from 'react-router-dom';
import { useNoNavigation } from './hooks/useNoNavigation';

function App() {
  const noNavigation = useNoNavigation();

  return (
    <div className="flex flex-col min-h-screen items-center">
      {!noNavigation && <Navigation />}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default App;