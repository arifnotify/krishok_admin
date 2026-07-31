export interface Category {
  _id: string;

  name: {
    en: string;
    bn: string;
  };

  image?: string;

  parentCategory?: string | Category | null;

  // NEW
  sortOrder?: number;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;
}
