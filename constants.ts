import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Blazer Midnight Velvet",
    price: "R$ 1.299",
    image: "https://picsum.photos/id/447/800/1000",
    description: "Uma peça de destaque para o conhecedor moderno. Veludo premium com corte italiano.",
    stock: 5,
    active: true
  },
  {
    id: 2,
    name: "Vestido Silk Horizon",
    price: "R$ 899",
    image: "https://picsum.photos/id/338/800/1000",
    description: "Elegância fluida que captura a essência do entardecer. Seda pura.",
    stock: 12,
    active: true
  },
  {
    id: 3,
    name: "Bolsa de Couro Obsidian",
    price: "R$ 2.450",
    image: "https://picsum.photos/id/656/800/1000",
    description: "Couro italiano feito à mão com detalhes em ouro 18k.",
    stock: 2,
    active: true
  },
  {
    id: 4,
    name: "Echarpe Fios de Ouro",
    price: "R$ 450",
    image: "https://picsum.photos/id/836/800/1000",
    description: "Tecido com fios de ouro reais para um brilho sutil e sofisticado.",
    stock: 20,
    active: true
  }
];

// Fallback generic video if a specific brand video isn't available
export const HERO_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-398-large.mp4";