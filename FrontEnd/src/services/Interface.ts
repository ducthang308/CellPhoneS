export interface LoginResponse {
    token: string;
    id: number;
    phone_number: string;
    roles_id: number;
    address: string;
    full_name: string;
    status: boolean;
}

export interface IRegisterRequest {
    full_name: string;
    phone_number: string;
    password: string;
    retype_pass: string;
    roles_id: number;
}

export interface IRole {
    roleId: number;
    roleName: string;
}

export interface IUser {
    userID: number;
    sdt?: string;
    fullName?: string;
    email?: string;
    address?: string;
    avatar?: string;
    password?: string;
    googleId?: string;
    roleId: number;
}

export interface ICategory {
    categoryID: number;
    categoryName: string;
    description?: string;
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

export interface CartDetail {
    cartDetailsId: number;
    cartId?: number;
    product: IProduct;
}

export interface Cart {
    cartId: number;
    status: string;
    userId?: number;
    cartDetails?: CartDetail[];
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
