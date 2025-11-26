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

export interface IProduct {
    productID: number;
    name: string;
    price: number;
    stock_quantity: number;
    image_url?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;

    categoryID?: number;
    brandID?: number;
    specID?: number;
}

export interface CartProduct {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    quantity: number;
    checked: boolean;
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

