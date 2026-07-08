export interface Category {
  _id: string;

  name: string;

  image?: string;

  parentCategory?: string | null;

  isActive?: boolean;
}