export interface Tax {
  id: string;
  title: string;
  description: string;
  tax: number;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}
