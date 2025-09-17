// src/types.ts

// Base Product type (matches both API data & internal use)
export interface Product {
    id: number;
    title: string;             // product name/title
    name?: string;             // optional - in case some functions expect 'name'
    description?: string;
    price: number;
    image?: string;            // single image field for convenience
    images?: string[];         // multiple images from API
    thumbnail?: string;        // optional thumbnail from API
    category?: string;
    rating?: number;
    stock?: number;
}
 
// The API response from dummyjson.com includes metadata and an array of products.
export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

// CartItem extends Product with quantity
export interface CartItem extends Product {
    quantity: number;
}

// Cart context methods
export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number | string) => void;
    updateQuantity: (id: number | string, quantity: number) => void;
    getCartTotalPrice: () => number;
}