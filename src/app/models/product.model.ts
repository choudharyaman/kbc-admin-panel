import {Tax} from './tax.model';
import {Discount} from './discount.model';

export enum ProductType {
  OTC = 'OTC',
  DRUGS = 'DRUGS',
  COSMETIC = 'COSMETIC',
  MEDICAL_INSTRUMENT = 'MEDICAL_INSTRUMENT',
  MEDICAL_EQUIPMENT = 'MEDICAL_EQUIPMENT',
  OTHER = 'OTHER'
}

export interface ProductMetrics {
  total_drugs_products: number;
  total_inactive_products: number;
  total_otc_products: number;
  total_prescription_products: number;
  total_products: number;
}

export interface ProductCategory {
  id: string;

  parent_category: ProductCategory;
  child_categories: ProductCategory[];

  name: string;
  slug: string;
  thumbnail: string;
  thumbnail_absolute_url: string;

  is_active: boolean;

  linked_products_count: number;

  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;

  product_type: ProductType;
  name: string;
  manufacturer: string;

  mrp: number;

  prescription_required: boolean;
  description: string;
  ingredients: string;
  uses: string;
  side_effects: string;

  package_size: string;

  tax: Tax | string | null;
  discount: Discount | string | null;

  is_active: boolean;

  categories: ProductCategory[];

  related_products: Product[];

  created_at: string;
  updated_at: string;
}
