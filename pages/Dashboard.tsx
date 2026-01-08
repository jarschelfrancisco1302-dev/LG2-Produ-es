import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Upload, Image as ImageIcon, Settings, DollarSign, Trash2 } from 'lucide-react';
import { Album } from '../types';
import { MOCK_ALBUMS } from '../constants';

const SALES_DATA = [
  { name: 'Jan', sales: 4000 },
  { name: 'Fev', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Abr', sales: 2780 },
  { name: 'Mai', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'albums' | 'upload'>('overview');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // State for albums to allow deletion
  const [albums, setAlbums] = useState<Album[]>(MOCK_ALBUMS);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDeleteAlbum = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este álbum?")) {
      setAlbums(prev => prev.filter(album => album.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel do Fotógrafo</h1>
        <div className="mt-4 md:mt-0 flex space-x-3">
           <button 
             onClick={() => setActiveTab('upload')}
             className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 shadow-sm transition-colors"
            >
            <Upload className="w-4 h-4 mr-2" />
            Carregar Fotos
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Visão Geral
          </button>
          <button
             onClick={() => setActiveTab('albums')}
             className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'albums'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Meus Álbuns
          </button>
          <button
             onClick={() => setActiveTab('upload')}
             className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upload
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Desempenho de Vendas</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SALES_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value}`, 'Receita']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 19.550,00</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total de Fotos Vendidas</p>
                  <p className="text-2xl font-bold text-gray-900">1.234</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'albums' && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
             {albums.length === 0 ? (
               <div className="p-8 text-center text-gray-500">Nenhum álbum encontrado.</div>
             ) : (
               <ul className="divide-y divide-gray-200">
                 {albums.map((album) => (
                   <li key={album.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                       <img src={album.coverUrl} alt={album.title} className="w-16 h-16 rounded object-cover" />
                       <div>
                         <h4 className="text-sm font-medium text-gray-900">{album.title}</h4>
                         <p className="text-sm text-gray-500">{album.photoCount} fotos • {album.eventDate}</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       <button className="p-2 text-gray-400 hover:text-brand-600">
                         <Settings className="w-5 h-5" />
                       </button>
                       <button 
                          className="p-2 text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteAlbum(album.id)}
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Carregar Novas Fotos</h3>
            <div 
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Arraste e solte suas fotos aqui, ou <span className="text-brand-600 font-medium cursor-pointer">selecione</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG até 50MB cada
              </p>
              <button 
                onClick={simulateUpload}
                className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Selecionar Arquivos
              </button>
            </div>

            {uploadProgress > 0 && (
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Enviando...</span>
                  <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-brand-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                {uploadProgress === 100 && (
                  <p className="mt-2 text-sm text-green-600 font-medium">Envio completo! Processando miniaturas...</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};