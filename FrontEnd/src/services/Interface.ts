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
    role: number;
}


export interface ICategory {
    categoryId: number;
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

export interface IReview {
    reviewID: number;
    orderID: number;

    comment?: string;
    video?: string;
    photo?: string;
}

export interface ProductImage {
    id: number;
    url: string;
    img_index: number;
}

export interface Specification {
    specId: number;
    screen: string;
    cpu: string;
    ram: string;
    storage: string;
    camera: string;
    battery: string;
    os: string;
}

export interface IProduct {
    productId: number;
    name: string;
    price: number;
    stockQuantity: number;
    description?: string;
    brandId: number;
    categoryId: number;
    specification?: Specification | null;
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
    products: OrderProduct[];
}