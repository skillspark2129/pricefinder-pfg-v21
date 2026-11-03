export const LOGO_URL = '/pfg-logo.svg';
export const APP_NAME = 'Price Finder Globally';

export const CATEGORIES = [
  { name: 'Mobiles', icon: 'Smartphone' },
  { name: 'Laptops', icon: 'Laptop' },
  { name: 'Tablets', icon: 'Tablet' },
  { name: 'Earbuds', icon: 'Headphones' },
  { name: 'Smart Watches', icon: 'Watch' },
  { name: 'Fashion', icon: 'Shirt' },
  { name: 'Home Appliances', icon: 'Refrigerator' },
  { name: 'Groceries', icon: 'ShoppingBasket' },
] as const;

export type CategoryName = (typeof CATEGORIES)[number]['name'];
export type CategoryIconName = (typeof CATEGORIES)[number]['icon'];
