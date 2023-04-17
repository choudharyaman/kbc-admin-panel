import {Customer, CustomerAddress, CustomerPrescriptionSlip} from './customer.model';
import {Tax} from './tax.model';
import {Discount} from './discount.model';
import {CourierAgent, DeliveryAgentType, DeliveryPerson} from './delivery-agent.model';
import {Product} from './product.model';
import {UserDevice} from './user.model';

export enum PaymentMethod {
  ONLINE = 'ONLINE',
  CARD = 'CARD',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
  EMI = 'EMI',
  UPI = 'UPI',
  CASH = 'CASH'
}

export enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  DENIED = 'DENIED'
}

export enum OrderPaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum OrderDeliveryStatus {
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}

export interface OrderMetrics {
  total_accepted_orders: number;
  total_in_transit_orders: number;
  total_new_orders: number;
  total_orders: number;
}

export interface OrderItem {
  id: string;
  product: Product;

  quantity: number;
  rate: number;

  tax: Tax;
  discount: Discount;

  gross_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_amount: number;

  created_at: string;
  updated_at: string;
}


export interface OrderPaymentTransaction extends UserDevice {
  id: string;

  payment_method: PaymentMethod;

  pg: string;
  pg_order_id: string;
  pg_txn_id: string;
  pg_data: string;

  status: OrderPaymentStatus;
  paid_at: string;

  created_at: string;
  updated_at: string;
}


export interface OrderDeliveryAgent {
  id: string;

  assigned_agent_type: DeliveryAgentType;

  by_self_agent: DeliveryPerson;

  courier_agent: CourierAgent;
  courier_agent_tracking_code: string;

  delivery_status: OrderDeliveryStatus;
  delivery_status_remark: string;

  created_at: string;
  updated_at: string;
}


export interface Order extends UserDevice {
  id: string;
  order_number: number;

  customer: Customer;
  delivery_address: CustomerAddress;

  has_prescription_slip: boolean;

  discount_amount: number;
  tax_amount: number;

  gross_amount: number;
  net_amount: number;

  preferred_payment_method: PaymentMethod;
  used_payment_method: PaymentMethod;

  is_paid: boolean;
  paid_at: string;

  status: OrderStatus;

  customer_remark: string;

  order_items: OrderItem[];
  order_prescription_slips: CustomerPrescriptionSlip[];
  order_delivery: OrderDeliveryAgent;
  order_payment_transactions: OrderPaymentTransaction[];

  created_at: string;
  updated_at: string;
}
