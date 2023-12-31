export interface Category {
  _id: string;
  categoryName: string;
  associatedColor: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransformedCategory {
  id: string;
  category: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  quantityInStock: number;
  quantity: number;
  averageUnitCost: number;
  unitCost: number;
  currentSalePrice: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransformedProduct {
  id: string;
  name: string;
  quantity: number;
  averageUnitCost: number;
  unitCost: number;
  currentSalePrice: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSummary {
  _id: {
    name: string;
    category: string;
  };
  lastUpdatedAt: string;
  categoryName: string;
}

export interface Sale {
  _id: string;
  quantitySold: number;
  salePrice: number;
  saleDate: string;
}