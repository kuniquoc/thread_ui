import Navigation from './components/Navigation';
import { Outlet } from 'react-router-dom';
import { useNoNavigation } from './hooks/useNoNavigation';

function App() {
  const noNavigation = useNoNavigation();

  return (
    <div className="flex flex-col min-h-screen items-center my-5">
      {!noNavigation && <Navigation />}
      <main className="flex-grow w-full max-w-4xl px-4 py-8 bg-gray-950 border-gray-600 rounded-3xl shadow-md">
        <Outlet />
      </main>
    </div>
  );
}

export default App;