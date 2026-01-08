import React, { useState } from 'react';
import { Trash2, Lock, ShieldCheck, Copy, ArrowLeft } from 'lucide-react';
import { CartItem, Order, User } from '../types';
import { generatePixPayment } from '../services/pixService';
import { PIX_KEY } from '../constants';

interface CheckoutProps {
  cart: CartItem[];
  user: User | null;
  onRemoveItem: (photoId: string) => void;
  onClearCart: () => void;
  onNavigate: (view: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, user, onRemoveItem, onClearCart, onNavigate }) => {
  const [step, setStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: ''
  });

  const total = cart.reduce((acc, item) => acc + (item.photo.price * item.quantity), 0);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create a unique Order ID
    const rawOrderId = `ORD${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`;
    
    try {
      // Generate PIX Data using the new backend service function
      const { pixCopiaCola, pixQrCodeBase64, txid } = await generatePixPayment(total, rawOrderId);
      
      const newOrder: Order = {
        id: txid,
        total,
        status: 'pending',
        pixCode: pixCopiaCola,
        pixQrCodeBase64: pixQrCodeBase64,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
        items: cart
      };

      setOrder(newOrder);
      setLoading(false);
      setStep('payment');
      onClearCart();
    } catch (error) {
      console.error("Erro ao gerar pagamento:", error);
      alert("Erro ao gerar o PIX. Tente novamente.");
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (order) {
      navigator.clipboard.writeText(order.pixCode);
      alert("Código PIX copiado para a área de transferência!");
    }
  };

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-8">Parece que você ainda não adicionou nenhuma foto.</p>
        <button 
          onClick={() => onNavigate('HOME')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Navegar Fotos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Step Indicator */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <div className={`flex flex-col items-center ${step === 'cart' ? 'text-brand-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'cart' ? 'border-brand-600' : 'border-gray-300'}`}>1</div>
            <span className="text-xs mt-1">Carrinho</span>
          </div>
          <div className="h-0.5 w-16 bg-gray-200"></div>
          <div className={`flex flex-col items-center ${step === 'details' ? 'text-brand-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'details' ? 'border-brand-600' : 'border-gray-300'}`}>2</div>
            <span className="text-xs mt-1">Detalhes</span>
          </div>
          <div className="h-0.5 w-16 bg-gray-200"></div>
          <div className={`flex flex-col items-center ${step === 'payment' ? 'text-brand-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 'payment' ? 'border-brand-600' : 'border-gray-300'}`}>3</div>
            <span className="text-xs mt-1">PIX</span>
          </div>
        </div>
      </div>

      {step === 'cart' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.photo.id} className="p-6 flex items-center">
                <img src={item.photo.thumbnailUrl} alt={item.photo.title} className="w-24 h-24 object-cover rounded-md" />
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{item.photo.title}</h3>
                    <p className="text-lg font-bold text-gray-900">R$ {item.photo.price.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 capitalize">{item.variant === 'digital' ? 'Digital' : 'Impressão'}</p>
                  <p className="text-xs text-gray-400 mt-1">ID: {item.photo.id}</p>
                </div>
                <button 
                  onClick={() => onRemoveItem(item.photo.id)}
                  className="ml-6 p-2 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
             <div className="mb-4 sm:mb-0">
               <span className="text-base text-gray-500">Total</span>
               <p className="text-2xl font-bold text-gray-900">R$ {total.toFixed(2)}</p>
             </div>
             <button
               onClick={() => setStep('details')}
               className="w-full sm:w-auto px-8 py-3 bg-brand-600 text-white rounded-md font-medium hover:bg-brand-700 transition-colors shadow-sm"
             >
               Ir para Pagamento
             </button>
          </div>
        </div>
      )}

      {step === 'details' && (
        <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Informações do Cliente</h3>
          <form onSubmit={handleCreateOrder} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
               <input 
                 type="text" 
                 required 
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700">Endereço de Email</label>
               <input 
                 type="email" 
                 required 
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
               />
               <p className="mt-1 text-xs text-gray-500">Enviaremos seus links de download aqui.</p>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700">CPF (para nota fiscal)</label>
               <input 
                 type="text" 
                 placeholder="000.000.000-00"
                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                 value={formData.cpf}
                 onChange={(e) => setFormData({...formData, cpf: e.target.value})}
               />
             </div>
             
             <div className="pt-4 border-t border-gray-200 mt-4">
               <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                 <p>Total a Pagar</p>
                 <p>R$ {total.toFixed(2)}</p>
               </div>
               
               <button
                 type="submit"
                 disabled={loading}
                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
               >
                 {loading ? 'Gerando PIX...' : 'Pagar com PIX'}
               </button>
               <button
                 type="button"
                 onClick={() => setStep('cart')}
                 className="w-full mt-2 text-center text-sm text-gray-500 hover:text-gray-700"
               >
                 Voltar ao Carrinho
               </button>
             </div>
          </form>
        </div>
      )}

      {step === 'payment' && order && (
        <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Gerado!</h2>
          <p className="text-gray-600 mb-6">Pedido #{order.id}</p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-500 mb-4">Escaneie o QR Code com o app do seu banco:</p>
            <div className="flex justify-center mb-6">
              {order.pixQrCodeBase64 ? (
                <img src={order.pixQrCodeBase64} alt="PIX QR Code" className="w-64 h-64 border-2 border-white shadow-sm" />
              ) : (
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                  QR Indisponível
                </div>
              )}
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-gray-50 text-sm text-gray-500">OU</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Copie e cole o código:</p>
              <div className="flex items-center">
                <input 
                  type="text" 
                  readOnly 
                  value={order.pixCode} 
                  className="flex-1 block w-full rounded-l-md border-gray-300 text-xs text-gray-500 bg-white p-2 border"
                />
                <button 
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-left bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-bold text-blue-800 flex items-center">
              <Lock className="w-4 h-4 mr-2" /> Próximos Passos
            </h4>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Abra seu app do banco e selecione PIX &gt; Pagar com Copia e Cola ou QR Code.</li>
              <li>Verifique o recebedor: <strong>Banlek / {PIX_KEY}</strong></li>
              <li>Após o pagamento, você receberá o link de download no email <strong>{formData.email}</strong>.</li>
            </ul>
          </div>
          
          <button 
             onClick={() => onNavigate('HOME')}
             className="mt-8 text-brand-600 hover:text-brand-800 font-medium"
          >
            Voltar para Loja
          </button>
        </div>
      )}
    </div>
  );
};