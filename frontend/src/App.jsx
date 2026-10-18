import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Registre from './pages/Registre';
import Animais from './pages/Animais';
import Funcionarios from './pages/Funcionarios';
import Financeiro from './pages/Financeiro';
import Maquinas from './pages/Maquinas';
import Safra from './pages/Safra';
import Relatorios from './pages/Relatorios';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('webfarm_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const getRouteFromUrl = () => {
    const validRoutes = ['dashboard', 'animais', 'maquinas', 'equipe', 'financeiro', 'safra', 'relatorios', 'login', 'registro'];

    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (validRoutes.includes(hash)) {
      return hash;
    }

    const rawPath = window.location.pathname.startsWith('/')
      ? window.location.pathname.slice(1)
      : window.location.pathname;
    const path = rawPath.split('/')[0].trim();
    if (validRoutes.includes(path)) {
      return path;
    }

    return currentUser ? 'dashboard' : 'login';
  };

  const [currentRoute, setCurrentRoute] = useState(getRouteFromUrl);

  useEffect(() => {
    const handleUrlChange = () => {
      const route = getRouteFromUrl();

      if (!currentUser && (route === 'dashboard' || route === 'animais' || route === 'maquinas' || route === 'equipe' || route === 'financeiro' || route === 'safra' || route === 'relatorios')) {
        window.history.replaceState(null, '', '/login');
        setCurrentRoute('login');
        return;
      }

      if (currentUser && (route === 'login' || route === 'registro')) {
        window.history.replaceState(null, '', '/dashboard');
        setCurrentRoute('dashboard');
        return;
      }

      if (window.location.hash || window.location.pathname !== `/${route}`) {
        window.history.replaceState(null, '', `/${route}`);
      }

      setCurrentRoute(route);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [currentUser]);

  useEffect(() => {
    const handleFarmUpdated = (e) => {
      if (e.detail?.nome) {
        setCurrentUser((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, fazenda: e.detail.nome, fazenda_dados: e.detail };
          try {
            localStorage.setItem('webfarm_auth_session', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    };
    window.addEventListener('webfarm:farm-updated', handleFarmUpdated);
    return () => window.removeEventListener('webfarm:farm-updated', handleFarmUpdated);
  }, []);

  const navigateTo = (route) => {
    window.history.pushState(null, '', `/${route}`);
    setCurrentRoute(route);
  };

  const handleLogin = (userPayload) => {
    if (!userPayload) return;
    setCurrentUser(userPayload);
    try {
      localStorage.setItem('webfarm_auth_session', JSON.stringify(userPayload));
    } catch {}
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('webfarm_auth_session');
    } catch {}
    navigateTo('login');
  };

  return (
    <div key={currentRoute} className="animate-page-enter">
      {currentRoute === 'dashboard' && currentUser && (
        <Dashboard
          onNavigate={(target) => navigateTo(target)}
          onLogout={handleLogout}
          user={currentUser}
        />
      )}

      {currentRoute === 'animais' && currentUser && (
        <Animais
          onNavigate={(target) => navigateTo(target)}
          onLogout={handleLogout}
          user={currentUser}
        />
      )}

      {currentRoute === 'maquinas' && currentUser && (
        <Maquinas
          onNavigate={(target) => navigateTo(target)}
          onLogout={handleLogout}
          user={currentUser}
        />
      )}

      {currentRoute === 'equipe' && currentUser && (
        <Funcionarios
          onNavigate={(target) => navigateTo(target)}
          onLogout={handleLogout}
          user={currentUser}
        />
      )}

      {currentRoute === 'financeiro' && currentUser && (
        <Financeiro
          onNavigate={(target) => navigateTo(target)}
          onLogout={handleLogout}
          user={currentUser}
        />
      )}

      {currentRoute === 'safra' && currentUser && (
        <Safra
          onNavigate={(target) => navigateTo(target)}
          onLogout={handleLogout}
          user={currentUser}
        />
      )}

      {currentRoute === 'relatorios' && currentUser && (
        <Relatorios
          onNavigate={(target) => navigateTo(target)}
          onLogout={handleLogout}
          user={currentUser}
        />
      )}

      {currentRoute === 'login' && (
        <Login
          onLogin={handleLogin}
          onNavigateRegister={() => navigateTo('registro')}
        />
      )}

      {currentRoute === 'registro' && (
        <Registre
          onNavigateLogin={() => navigateTo('login')}
          onRegisterSuccess={handleLogin}
        />
      )}
    </div>
  );
}
