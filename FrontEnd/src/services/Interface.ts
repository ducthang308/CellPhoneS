export interface LoginResponse {
    token: string;
    userId: number;
    sdt: string;
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

export interface ProductImage {
    id?: number;                     
    img_index: number;             
    url: string | null;
    product_id?: number | null;      
}

export interface IProduct {
    ProductID?: number;              
    name: string | null;
    price: number | null;            
    Stock_Quantity?: number | null;  
    Image_URL?: string | null;
    description?: string | null;
    Created_At?: string | null;      
    Updated_At?: string | null;      
    
    // Foreign keys
    BrandID?: number | null;
    CategoryID?: number | null;
    SupplierID?: number | null;
    SpecID?: number | null;          
    
    // Sequelize/ORM fields (lowercase với underscore)
    createdAt?: string | null;       
    stockQuantity?: number | null;
    updatedAt?: string | null;       
    brand_id?: number | null;
    category_id?: number | null;
    spec_id?: number | null;         
    
    // Relation data (khi JOIN với bảng productimage)
    productImages?: ProductImage[];
}