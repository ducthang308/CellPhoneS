export interface LoginResponse {
    userId: number;
    sdt: string;
    fullName: string;
    email: string;
    address: string;
    avatar: string | null;
    role: number;
    token: string;
    cartId: number;
}

export interface IRegisterRequest {
    sdt: string;
    hoVaTen: string;
    email: string;
    diaChi: string;
    matKhau: string;
    role?: number;
}


export interface IRole {
    roleId: number;
    roleName: string;
}

export interface IUser {
    userId: number;
    sdt: string;
    fullName?: string;
    email?: string;
    address?: string;
    avatar?: string | null;
    role?: number;
}


export interface ICategory {
    categoryId: number;
    categoryName: string;
    description: string;
}

export interface CreateCategoryRequest {
  categoryName: string;
  description: string;
}

export interface ISpecification {
    specID: number;
    screen?: string;
    cpu?: string;
    ram?: string;
    storage?: string;
    camera?: string;
    battery?: string;
    os?: string;
}


export interface IOrder {
    orderID: number;
    order_date: string;
    status: string;
    userID?: number;
}

export interface IOrderDetail {
    orderDetailID: number;
    orderID: number;
    productID: number;
    quantity: number;
}


export interface ProductImage {
    id: number;
    url: string;
    img_index: number;
}

export interface Specification {
    specId?: number;
    screen: string;
    cpu: string;
    ram: string;
    storage: string;
    camera: string;
    battery: string;
    os: string;
}

export interface IProduct {
    productId?: number;
    name: string;
    price: number;
    stockQuantity: number;
    description?: string;
    brandId: number;

    supplierId: number;
    categoryId: number;
    specification: Specification ;
    productImages?: ProductImage[];
}

export interface CartDetailRequestDTO {
    cartId: number;
    productId: number;
}

export interface CartDetailResponse {
    cartDetailsId: number;
    cartId: number;
    product: IProduct;
}

export interface CartDTO {
    cartId: number;
    userId: number;
    status: string;
}

export type AddToCartRequest = CartDetailRequestDTO;

export interface OrderResponse {
    orderID: number;
}

export interface CreateOrderDetailRequest {
    orderID: number;
    productID: number;
    quantity: number;
}

export interface OrderDetailResponse {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
}

export interface OrderDetailItem {
    product: IProduct;
    quantity: number;
}

export interface PayPalPaymentRequest {
    localOrderId: string;
    amount: number;
    currency: string;
    description: string;
}

export interface PayPalCreateResponse {
    approvalUrl: string;
}

export interface Notification {
  notificationId: number;
  title: string;
  notificationType: 'PERSONAL' | 'PROMOTION' | 'SYSTEM' | 'ORDER'; // thêm type nếu backend mở rộng
  content: string;           // message thực tế
  isRead: boolean;
  // createdAt có thể có hoặc không, tùy backend trả về
  // createdAt?: string;
}
export interface OrderProduct {
    productID: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string | null;
    
}

export interface OrderRequest {
    userID: number;
    status: string;
    paymentStatus: string;
    orderDate?: string;
}


export interface OrderFullResponse {
  orderID: number;
  orderDate: string;
  status: string;
  paymentStatus: string;
  userID: number;

  subTotal: number;
  discountAmount: number;
  totalAmount: number;

  products: OrderProduct[];
}


export interface IReview {
    reviewID: number;
    productID: number;
    orderID?: number;
    userName: string;
    rating: number;
    comment: string;
    photoUrl?: string;
    videoUrl?: string;
}

export interface CreateOrderRequest {
  userID: number;
  discountCode?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface Brand {
  brandId: number;
  name: string;
  country: string;
  description?: string;
}

export interface BrandCreateRequest {
  name: string;
  country: string;
  description?: string;
}

export interface OrderResponse {
  orderID: number;
  orderDate: string;
  status: string;
  paymentMethod?: string;
  userID?: number;
  note?: string;
}

export interface OrderDetailResponse {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
}

export interface StockInRequest {
  quantity: number;
  date: string;       
  note?: string;
  batchId: number;     
}

export interface StockInResponse {
  stockInID: number;
  quantity: number;
  note?: string;
  date?: string;
  batch?: BatchResponse;
  user?: UserDTO;
}

export interface UserDTO {
  userId: number;
  sdt?: string;
  fullName?: string;
  email?: string;
  address?: string;
  avatar?: string;
}

export interface BatchResponse {
  batchID: number;
  productionDate?: string;
  quantity?: number;
  priceIn?: number;
  expiry?: string;
  product?: IProduct ;
}

export interface StockOutResponse {
  stockOutId: number;
  batch?: BatchResponse;
  quantity: number;
  note?: string;
  date?: string;
  user?: UserDTO;
}

export interface StockOutRequest {
  quantity: number;
  date: string;       
  note?: string;
  batchId: number;     
}

export interface ISupplier {
  supplierId: number;
  supplierName: string;

  // Optional – dùng khi mở rộng
  phone?: string;
  email?: string;
  address?: string;
  note?: string;

  createdAt?: string;   // ISO string từ backend
  updatedAt?: string;
}

export interface Discount {
  id?: number;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usedCount?: number;
  startAt?: string | null;
  endAt?: string | null;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
    userId: number;
    phone: string;
    fullName?: string;
    email?: string;
    address?: string;
    avatar?: string | null;
    role?: number;
}

export interface OrderProductResponse {
  productID: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface OrderWithUserResponse {
  orderId: number;
  orderDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  user: User;
  products: OrderProductResponse[];
}

export interface MonthlyOrderStatistic {
  thang: number;
  soLuong: number;
  doanhThu: number;
}

export interface SalesAndQuantityResponse {
  data: MonthlyOrderStatistic[];
  tongDoanhThu: number;
  tongDonHang: number;
  years: number[];
}

export interface OrderStatusStatistic {
  availableYears: number[];
  selectedYear?: number | null;
  selectedMonth?: number | null;
  selectedDay?: number | null;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface InventoryStatisticResponse {
  availableYears: number[];
  selectedYear: number | null;
  selectedMonth: number | null;
  selectedDay: number | null;
  items: InventoryStatisticItem[];
}

export interface InventoryStatisticItem {
  product: {
    productId: number;
    productName: string;
    imageUrl?: string;
    quantity: number;
  };
  supplier: {
    supplierName?: string | null;
  };
  batch: {
    batchId: number;
    expiryDate?: string | null;
  };
}

export interface InventoryStatisticResponse {
  availableYears: number[];
  selectedYear: number | null;
  selectedMonth: number | null;
  selectedDay: number | null;
  items: InventoryStatisticItem[];
}
