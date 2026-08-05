export interface TranslatedText {
  en: string;
  bn: string;
}

export interface Product {
  _id: string;

  title: TranslatedText;

  description: TranslatedText;

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
    division: TranslatedText;
    district: TranslatedText;
  }[];

  isFlashSale?: boolean;

  isActive: boolean;

  productType?: string;

  expiryDate?: string;

  isFeatured?: boolean;

  homePriority?: number;
}