import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Tag, Plus, ShoppingCart, X, Camera } from 'lucide-react';
import { Album, Photo, CartItem } from '../types';
import { MOCK_ALBUMS, generateMockPhotos } from '../constants';

interface StoreProps {
  onAddToCart: (item: CartItem) => void;
  onNavigate: (view: any, params?: any) => void;
  currentAlbumId?: string;
}

export const Store: React.FC<StoreProps> = ({ onAddToCart, onNavigate, currentAlbumId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (currentAlbumId) {
      // Simulate API fetch
      const album = MOCK_ALBUMS.find(a => a.id === currentAlbumId);
      if (album) {
        setPhotos(generateMockPhotos(album.id, 24, album.pricePerPhoto));
      }
    }
  }, [currentAlbumId]);

  if (currentAlbumId) {
    // Single Album View
    const album = MOCK_ALBUMS.find(a => a.id === currentAlbumId);
    if (!album) return <div>Álbum não encontrado</div>;

    return (
      <div className="min-h-screen bg-white">
        {/* Album Header */}
        <div className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
             <img src={album.coverUrl} className="w-full h-full object-cover filter blur-sm" alt="Background" />
          </div>
          <div className="relative max-w-7xl mx-auto">
            <button 
              onClick={() => onNavigate('HOME')}
              className="mb-6 text-gray-300 hover:text-white flex items-center text-sm font-medium"
            >
              ← Voltar para Eventos
            </button>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{album.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
               <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {album.eventDate}</span>
               <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {album.location}</span>
               <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white">{album.photoCount} fotos</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div 
                key={photo.id} 
                className="group relative aspect-[3/2] bg-gray-100 overflow-hidden rounded-lg cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img 
                  src={photo.thumbnailUrl} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Watermark overlay preview */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none select-none">
                   <span className="text-white font-bold text-xl transform -rotate-45">BANLEK PREVIEW</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="text-white font-medium text-sm truncate">{photo.title}</p>
                   <p className="text-brand-300 text-xs font-bold">R$ {photo.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <Lightbox 
            photo={selectedPhoto} 
            onClose={() => setSelectedPhoto(null)} 
            onAddToCart={(item) => {
              onAddToCart(item);
              setSelectedPhoto(null);
            }}
          />
        )}
      </div>
    );
  }

  // Home / All Albums View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Capture o Momento
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Encontre suas fotos profissionais de esportes dos eventos recentes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
        {MOCK_ALBUMS.filter(a => a.isPublic).map((album) => (
          <div key={album.id} className="group relative" onClick={() => onNavigate('ALBUM_VIEW', album.id)}>
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-90 lg:h-80 lg:aspect-none cursor-pointer">
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-full h-full object-center object-cover lg:w-full lg:h-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="mt-4 flex justify-between cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {album.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> {album.eventDate}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {album.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium text-brand-600">R$ {album.pricePerPhoto.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sub-component: Lightbox
const Lightbox: React.FC<{ photo: Photo; onClose: () => void; onAddToCart: (item: CartItem) => void }> = ({ photo, onClose, onAddToCart }) => {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
           <button onClick={onClose} className="absolute top-4 right-4 text-white z-10 bg-black/50 rounded-full p-2 hover:bg-black/70">
             <X className="w-6 h-6" />
           </button>
           
           <div className="sm:flex">
             {/* Image Area */}
             <div className="sm:w-2/3 bg-black flex items-center justify-center p-4 relative">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="max-h-[80vh] w-auto object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <span className="text-white text-4xl font-bold transform -rotate-45 opacity-50">BANLEK PREVIEW</span>
                </div>
             </div>

             {/* Sidebar Info */}
             <div className="sm:w-1/3 p-6 bg-white flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{photo.title}</h3>
                
                <div className="text-sm text-gray-500 space-y-2 mb-6 border-b pb-4">
                  <p className="flex items-center"><Camera className="w-4 h-4 mr-2" /> {photo.exif?.camera}</p>
                  <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {photo.exif?.date}</p>
                  <p className="text-xs">Resolução Original: {photo.width} x {photo.height}px</p>
                </div>

                <div className="space-y-4 flex-grow">
                   <p className="font-medium text-gray-900">Escolha o formato:</p>
                   
                   <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-brand-500 bg-brand-50 border-brand-500">
                      <div className="flex items-center">
                        <input type="radio" name="format" className="h-4 w-4 text-brand-600 focus:ring-brand-500" defaultChecked />
                        <span className="ml-3 font-medium text-gray-900">Download Digital Alta Res.</span>
                      </div>
                      <span className="font-bold text-gray-900">R$ {photo.price.toFixed(2)}</span>
                   </label>
                   
                   <p className="text-xs text-gray-500 mt-2">
                     * Download instantâneo após confirmação do pagamento PIX.
                   </p>
                </div>

                <button
                  onClick={() => onAddToCart({ photo, quantity: 1, variant: 'digital' })}
                  className="mt-6 w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};