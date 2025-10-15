import { ProductsTypes } from "../app/page";
import { ProductType } from "./types";

export const currencySymbols: Record<string, string> = {
  USD: '$',
  JPY: '¥'
};

export type ProductWithCurrency = Omit<ProductsTypes, 'price' | 'oldPrice'> & {
  price: string;
  oldPrice: string;
  currency: string;
  currencySymbol: string;
};

export const formatPrice = (price: string | number, currency: string): string => {
  if (currency === 'JPY') {
    return Number(price).toLocaleString('en-US');
  }
  return String(price);
};

const formatPrices = (
  price: string | number, 
  oldPrice: string | number, 
  currency: string
): { formattedPrice: string; formattedOldPrice: string } => {
  if (currency === 'JPY') {
    return {
      formattedPrice: formatPrice(price, currency),
      formattedOldPrice: formatPrice(oldPrice, currency)
    };
  }
  return {
    formattedPrice: String(price),
    formattedOldPrice: String(oldPrice)
  };
};

// will be better to add a caches for the rates and using something like tanstack/react-query
export async function convert(amount: number, from: string = 'USD', to: string = 'JPY'): Promise<string> {
  try {
    const response = await fetch(`https://api.frankfurter.dev/v1/latest?amount=${amount}&base=${from}&symbols=${to}`);
    const data = await response.json();

    const convertedAmount = data?.rates?.[to];

    if (!convertedAmount) {
      throw new Error('Failed to get currency rate');
    }

    return String(convertedAmount);
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}

export async function productsWithCurrency(
  input: ProductsTypes[], 
  fromCurrency: string = 'USD', 
  toCurrency: string = 'JPY'
): Promise<ProductWithCurrency[]> {
  
  const currencySymbol = currencySymbols[toCurrency] || toCurrency;
  
  if (fromCurrency === toCurrency) {
    return input.map(product => {
      const { formattedPrice, formattedOldPrice } = formatPrices(
        product.price, 
        product.oldPrice, 
        toCurrency
      );
      
      return {
        ...product,
        price: formattedPrice,
        oldPrice: formattedOldPrice,
        currency: toCurrency,
        currencySymbol
      };
    });
  }

  return await Promise.all(input.map(async (product) => {
    if (product.price === 0 || product.oldPrice === 0) {
      return { 
        ...product, 
        price: '0', 
        oldPrice: '0',
        currency: toCurrency,
        currencySymbol
      };
    }

    const priceWithNewCurrency = await convert(product.price, fromCurrency, toCurrency);
    const oldPriceWithNewCurrency = await convert(product.oldPrice, fromCurrency, toCurrency);
    
    const { formattedPrice, formattedOldPrice } = formatPrices(
      priceWithNewCurrency,
      oldPriceWithNewCurrency,
      toCurrency
    );
    
    return { 
      ...product, 
      price: formattedPrice, 
      oldPrice: formattedOldPrice,
      currency: toCurrency,
      currencySymbol
    };
  }));
}

export async function productWithCurrency(
  input: ProductType, 
  fromCurrency: string = 'USD', 
  toCurrency: string = 'JPY'
): Promise<ProductType> {
  
  const currencySymbol = currencySymbols[toCurrency] || toCurrency;
  
  if (fromCurrency === toCurrency) {
    const { formattedPrice, formattedOldPrice } = formatPrices(
      input.price,
      input.oldPrice,
      toCurrency
    );
    
    return ({
      ...input,
      price: formattedPrice,
      oldPrice: formattedOldPrice,
      currency: toCurrency,
      currencySymbol
    });
  }

  const priceWithNewCurrency = await convert(Number(input.price), fromCurrency, toCurrency);
  const oldPriceWithNewCurrency = await convert(Number(input.oldPrice), fromCurrency, toCurrency);

  const { formattedPrice, formattedOldPrice } = formatPrices(
    priceWithNewCurrency,
    oldPriceWithNewCurrency,
    toCurrency
  );

  return ({
    ...input,
    price: formattedPrice,
    oldPrice: formattedOldPrice,
    currency: toCurrency,
    currencySymbol
  });
}
