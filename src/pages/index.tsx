import Navbar from "@/components/Navbar/Navbar";
import Products from "@/components/Products/Products";

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar/>
      <Products/>
    </main>
  );
}
