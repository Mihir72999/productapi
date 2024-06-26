type YourProductType = {
    id: string
    name: string
    availableQty: number
    price: number
    brand: string
    brandmodel: (string | null)[]
    image: string

}
export type BrandProductMap = { [brand: string]: YourProductType };
export interface IProduct {
  
  id: string;
  availableQty: number | null;
  brand: string | null;
  brandmodel: string | null;
}

export type Products = {
  id:string | null;
  name: string | null;
    price: number | null;
    availableQty: number | null;
    image: string | null;
    brand: string | null;
    brandmodel: string | null;
}[]
export type Post = {
  id:string 
  title:string
  date:Date
}
