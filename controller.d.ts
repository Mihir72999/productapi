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

