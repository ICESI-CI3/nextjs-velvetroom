import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { addToCart } from "@/services/cart";
import { toast } from "sonner";

  function AddCartButton({ productId }: { productId: number }) {
    const { user } = useAuth();
    const { refresh } = useCart();
    const add = async () => {
      if (!user) {
        toast.error("Debes iniciar sesión para agregar al carrito mi estimado.");
        return;
      }
      try {
        await addToCart(productId, 1);
        refresh();
        toast.success('Añadido al carrito');

      } catch {
        toast.error("No se pudo agregar al carrito.");
      }
    };

    return (
      <button className="vr-btn" onClick={add}>
        Añadir al carrito
      </button>
    );
  }

  export default AddCartButton;