import { Album, Photo, User, UserRole } from './types';

export const PIX_KEY = "49999825638";
export const MERCHANT_NAME = "Banlek Sports";
export const MERCHANT_CITY = "SAO PAULO";

export const MOCK_USER_PHOTOGRAPHER: User = {
  id: 'u_photo_1',
  name: 'Silva Fotografia',
  email: 'silva@banlek.com',
  role: UserRole.PHOTOGRAPHER
};

export const MOCK_USER_CUSTOMER: User = {
  id: 'u_cust_1',
  name: 'João Atleta',
  email: 'joao@gmail.com',
  role: UserRole.CUSTOMER
};

export const MOCK_ALBUMS: Album[] = [
  {
    id: 'a1',
    photographerId: 'u_photo_1',
    title: 'Maratona da Cidade 2024',
    description: 'Fotos de alta energia na linha de chegada.',
    coverUrl: 'https://picsum.photos/seed/marathon/800/600',
    eventDate: '15/05/2024',
    location: 'São Paulo, SP',
    tags: ['corrida', 'maratona', 'manhã'],
    pricePerPhoto: 15.90,
    isPublic: true,
    photoCount: 124
  },
  {
    id: 'a2',
    photographerId: 'u_photo_1',
    title: 'Finais Regionais de Crossfit',
    description: 'Intensidade e força em exibição.',
    coverUrl: 'https://picsum.photos/seed/crossfit/800/600',
    eventDate: '10/06/2024',
    location: 'Rio de Janeiro, RJ',
    tags: ['crossfit', 'academia', 'interior'],
    pricePerPhoto: 29.90,
    isPublic: true,
    photoCount: 45
  },
  {
    id: 'a3',
    photographerId: 'u_photo_1',
    title: 'Copa de Futebol Juvenil',
    description: 'Partida final Sub-15.',
    coverUrl: 'https://picsum.photos/seed/soccer/800/600',
    eventDate: '20/04/2024',
    location: 'Curitiba, PR',
    tags: ['futebol', 'crianças', 'gramado'],
    pricePerPhoto: 12.50,
    isPublic: false,
    photoCount: 200
  }
];

export const generateMockPhotos = (albumId: string, count: number, basePrice: number): Photo[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `p_${albumId}_${i}`,
    albumId,
    url: `https://picsum.photos/seed/${albumId}${i}/1200/800`,
    thumbnailUrl: `https://picsum.photos/seed/${albumId}${i}/400/300`,
    title: `Foto #${i + 1}`,
    price: basePrice,
    width: 1200,
    height: 800,
    exif: {
      camera: 'Canon EOS R5',
      date: '15/05/2024 10:30:00'
    }
  }));
};