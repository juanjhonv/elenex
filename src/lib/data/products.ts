import { sdk } from "../sdk";

// export const listProducts = async (regionId: string) => {
export const listProducts = async () => {
  try {
    // const { products } = await sdk.store.product.list({
    //   region_id: regionId,
    // });
    const { products } = await sdk.store.product.list();
    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch products");
  }
};