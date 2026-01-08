import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Store } from './pages/Store';
import { Checkout } from './pages/Checkout';
import { User, UserRole, ViewState, CartItem } from './types';
import { MOCK_USER_PHOTOGRAPHER, MOCK_USER_CUSTOMER } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [viewParams, setViewParams] = useState<any>(null);

  const navigate = (newView: ViewState, params?: any) => {
    setView(newView);
    if (params) setViewParams(params);
  };

  const login = (role: UserRole) => {
    if (role === UserRole.PHOTOGRAPHER) {
      setUser(MOCK_USER_PHOTOGRAPHER);
      navigate('DASHBOARD');
    } else {
      setUser(MOCK_USER_CUSTOMER);
      navigate('HOME');
    }
  };

  const logout = () => {
    setUser(null);
    navigate('HOME');
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // Check if already exists
      const exists = prev.find(i => i.photo.id === item.photo.id && i.variant === item.variant);
      if (exists) {
        return prev.map(i => i.photo.id === item.photo.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
    alert("Adicionado ao carrinho!");
  };

  const removeFromCart = (photoId: string) => {
    setCart(prev => prev.filter(i => i.photo.id !== photoId));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar 
        user={user} 
        cartCount={cart.length} 
        onNavigate={navigate} 
        onLogout={logout}
        currentView={view}
      />

      <main>
        {view === 'HOME' && (
          <Store onAddToCart={addToCart} onNavigate={navigate} />
        )}

        {view === 'ALBUM_VIEW' && (
          <Store 
            onAddToCart={addToCart} 
            onNavigate={navigate} 
            currentAlbumId={viewParams}
          />
        )}

        {view === 'DASHBOARD' && user?.role === UserRole.PHOTOGRAPHER && (
          <Dashboard />
        )}

        {view === 'CART' && (
          <Checkout 
             cart={cart}
             user={user}
             onRemoveItem={removeFromCart}
             onClearCart={() => setCart([])}
             onNavigate={navigate}
          />
        )}

        {/* Simple Login Screen for Demo */}
        {(view === 'LOGIN' || view === 'REGISTER') && (
          <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  {view === 'LOGIN' ? 'Entrar na sua conta' : 'Criar uma conta'}
                </h2>
              </div>
              <div className="mt-8 space-y-6">
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => login(UserRole.CUSTOMER)}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    Continuar como Cliente (Demo)
                  </button>
                  <button
                    onClick={() => login(UserRole.PHOTOGRAPHER)}
                    className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    Continuar como Fotógrafo (Demo)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 Banlek Sports Photography. Todos os direitos reservados.</p>
          <p className="mt-2">Chave PIX: 49999825638</p>
        </div>
      </footer>
    </div>
  );
};

export default App;