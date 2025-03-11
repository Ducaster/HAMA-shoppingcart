export interface ShoppingCartItem {
  googleId: string; // 파티션 키
  products: {
    site: string;
    category: string;
    link: string;
    uid: string;
    name: string;
    brand: string;
    sale_price: string;
    img: string;
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
}
