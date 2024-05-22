import Navbar from "@/components/Navbar/Navbar";
import Products from "@/components/Products/Products";

export default function Home() {
  return (
    <main>
      <div className="absolute z-[-10] h-full w-full bg-black">
      <div className="background-overlay"></div>
      <div className="radial-gradient-overlay"></div>
    </div>
      <Navbar />
      <Products />
    </main>
  );
}
