import { client } from "../../../lib/client";
import { productWithCurrency, productsWithCurrency } from "../../../lib/currency";
import Show from "../Show.jsx";

type PageProps = {
  params: {
    slug: number;
  };
};

async function getProduct(slug) {
  // QUERY
  const oneProduct = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  // GET SINGLE PRODUCT
  const product = await client.fetch(oneProduct);

  const productConverted = await productWithCurrency(product);

  // GET RELATED PRODUCTS
  const products = await client.fetch(productsQuery);

  const productsConverted = await productsWithCurrency(products);

  return { product: productConverted, products: productsConverted };
}

export default async function SingleProduct({ params: { slug } }: PageProps) {
  const { product, products } = await getProduct(slug);

  return <Show product={product} products={products} />;
}

export const generateStaticParams = async () => {
  const query = `*[_type == "product"] {
        slug {
            current
        }
    }
    `;

  const products = await client.fetch(query);

  return products.map((e) => ({
    slug: e.slug.current,
  }));
};
