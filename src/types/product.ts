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

  youtubeVideoUrl:string;
  price: number;

  discountPrice: number;

  flashDiscountPrice?: number;

  stock: number;

  images: string[];

  category: {
  _id: string;
  name: string;
      };

  unit: string;

  brand: string;

  location: string;

  isFlashSale?: boolean;

    // ⭐ ADD THIS
  isActive:boolean;
}