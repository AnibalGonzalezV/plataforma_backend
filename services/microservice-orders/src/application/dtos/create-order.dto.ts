export class CreateOrderDto {
  storeId: number;
  clientId: number;
  courierId: number;
  deliveryType: string;
  deliveryState: string;
  totalAmount: number;
}
