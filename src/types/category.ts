export interface Category {
  _id: string;

  name: {
    en: string;
    bn: string;
  };

  image?: string;

  parentCategory?: string | Category | null;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;
}
