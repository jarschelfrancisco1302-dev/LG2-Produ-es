export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  PHOTOGRAPHER = 'PHOTOGRAPHER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Photo {
  id: string;
  albumId: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  price: number;
  width: number;
  height: number;
  exif?: {
    camera: string;
    date: string;
  };
}

export interface Album {
  id: string;
  photographerId: string;
  title: string;
  description: string;
  coverUrl: string;
  eventDate: string;
  location: string;
  tags: string[];
  pricePerPhoto: number;
  isPublic: boolean;
  photoCount: number;
}

export interface CartItem {
  photo: Photo;
  quantity: number;
  variant: 'digital' | 'print_small' | 'print_large';
}

export interface Order {
  id: string;
  total: number;
  status: 'pending' | 'paid';
  pixCode: string;
  pixQrCodeBase64: string; // Changed from pixQrImage to match new service
  expiresAt: string;
  items: CartItem[];
}

export type ViewState = 
  | 'HOME' 
  | 'LOGIN' 
  | 'REGISTER' 
  | 'ALBUM_VIEW' 
  | 'DASHBOARD' 
  | 'CART' 
  | 'CHECKOUT'
  | 'ORDER_SUCCESS';