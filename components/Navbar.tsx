import React from 'react';
import { ShoppingCart, Camera, LogOut } from 'lucide-react';
import { User, UserRole, ViewState } from '../types';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  currentView: ViewState;
}

export const Navbar: React.FC<NavbarProps> = ({ user, cartCount, onNavigate, onLogout, currentView }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('HOME')}>
            <Camera className="h-8 w-8 text-brand-600 mr-2" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">BANLEK</span>
          </div>

          <div className="flex items-center space-x-4">
            {user?.role === UserRole.PHOTOGRAPHER && (
              <button
                onClick={() => onNavigate('DASHBOARD')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'DASHBOARD' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Painel
              </button>
            )}

            <button
              onClick={() => onNavigate('CART')}
              className="relative p-2 text-gray-600 hover:text-brand-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3 ml-2 border-l pl-4 border-gray-200">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.role === UserRole.PHOTOGRAPHER ? 'Fotógrafo' : 'Cliente'}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => onNavigate('LOGIN')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Entrar
                </button>
                <button
                  onClick={() => onNavigate('REGISTER')}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 shadow-sm"
                >
                  Cadastrar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};