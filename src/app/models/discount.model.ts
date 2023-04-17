export enum DiscountType {
  ABSOLUTE = 'ABSOLUTE',
  RELATIVE = 'RELATIVE'
}

export interface Discount {
  id: string;
  title: string;
  description: string;

  discount_type: DiscountType;
  discount_amount: number;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}
