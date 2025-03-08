import Image from "next/image";
import ProductSection from "@/app/ProductSection";
import {fetchProduct} from "@/app/lib/action";

export default async function Home(props: {
    searchParams?: Promise<{
        search?: string;
        filterPrice?: string;
        filterStock?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const data = await fetchProduct(searchParams?.search || '', searchParams?.filterPrice || '', searchParams?.filterStock || '');

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <ProductSection products={data} />

      </main>
    </div>
  );
}
