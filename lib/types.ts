export interface ProductType {
    _createdAt: string,
    _id: string,
    _rev: string,
    _type: string,
    _updatedAt: string,
    details: string,
    image: [
      { _key: string, _type: 'image', asset: [Object] },
      { _key: string, _type: 'image', asset: [Object] },
      { _key: string, _type: 'image', asset: [Object] }
    ],
    model: string,
    name: string,
    oldPrice: string | number,
    price: string | number,
    slug: { _type: 'slug', current: string },
    currencySymbol: string,
    currency: string
}