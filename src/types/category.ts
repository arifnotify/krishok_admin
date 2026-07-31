export interface Category { 

  _id: string;


  name: {
    en: string;
    bn: string;
  };


  image?: string;


  parentCategory?: string | Category | null;


  // Category sorting
  sortOrder?: number;


  // Category active status
  isActive?: boolean;


  // ⭐ Show this category on Home Screen
  showOnHome?: boolean;


  createdAt?: string;


  updatedAt?: string;

}