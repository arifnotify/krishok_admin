export interface Product {
  _id: string;

  title: {
    en: string;
    bn: string;
  };

  description: {
    en: string;
    bn: string;
  };

  youtubeVideoUrl?: string;

  price: number;

  discountPrice: number;

  flashSalePrice?: number;

  stock: number;

  images: string[];

  category: {
    _id: string;
    name: string;
  };

  unit: string;

  brand?: string;

  locations: {
    _id: string;
    division: string;
    district: string;
  }[];

  isFlashSale?: boolean;

  isActive: boolean;

  productType?: string;

  expiryDate?: string;

  isFeatured?: boolean;

  homePriority?: number;
}
