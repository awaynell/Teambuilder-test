"use client";
import { useContext, useMemo } from "react";
import { BannerDataTypes } from "../app/page";
import { ProductWithCurrency } from "../lib/currency";
import { sortProducts } from "../lib/utils";
import { UC } from "../app/context";
import FooterBanner from "../comps/FooterBanner";
import MainBanner from "./MainBanner";
import Products from "../app/Products";

interface HomeProps {
  products: ProductWithCurrency[];
  bannerData: BannerDataTypes[];
}

const Home = ({ products, bannerData }: HomeProps) => {
  const { sortBy, setSortBy } = useContext(UC);

  const sortedProducts = useMemo(() => {
    return sortProducts(products, sortBy);
  }, [products, sortBy]);

  return (
    <main>
      {/* === MAIN BANNER  */}
      <MainBanner banner={bannerData[0]} />

      <section className="mb-4 flex items-center flex-col">
        <h1
          className="headTitle px-8 py-4 sm:py-2 sm:text-4xl text-2xl text-secondary
         font-sans font-extrabold sm:rounded-t-3xl"
        >
          Best Selling Headphones
        </h1>
      </section>

      {/* === SORT SELECT  */}
      <section className="flex justify-center items-center gap-3 mb-6 lg:mx-20">
        <label htmlFor="sort-select" className="text-gray-700 font-medium">
          Sort by Price:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
        >
          <option value="default">Default</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>
      </section>

      {/* === SHOW PRODUCTS  */}
      <section
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3
       lg:mx-20 overflow-hidden"
      >
        {/* === MAP PRODUCTS  */}
        {sortedProducts?.map((product: ProductWithCurrency) => {
          return <Products key={product._id} products={product} />;
        })}
      </section>

      {/* ==== FOOTER BANNER  */}
      <FooterBanner bannerData={bannerData && bannerData[1]} />
    </main>
  );
};

export default Home;
