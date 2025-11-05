/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem, clearCart } from "@/services/cart";
import { useAuth } from "@/contexts/AuthContext";
import RoleGate from "@/components/RoleGate";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/services/orders";
import router from "next/router";
import api from "@/services/api";

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<any>(null);

  const { refresh: refreshCartCount } = useCart();

    const refresh = () => {
    getCart().then(setCart);
    refreshCartCount(); // 🔥 actualiza badge de navbar
    };

if (!user) {
   if (typeof window !== 'undefined') {
     window.location.href = '/unauthorized?type=401';
   }
   return null;
 }

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  if (!cart)
    return (
      <div className="vr-card" style={{ margin: "40px auto", maxWidth: 500, padding: 24 }}>
        <h2 className="vr-title" style={{ textAlign: "center" }}>Cargando carrito...</h2>
      </div>
    );

  const total = cart.items.reduce(
    (sum: number, i: any) => sum + i.product.price_cents * i.quantity,
    0
  );


    const handleCheckout = async () => {
    try {
        await createOrder();
        toast.success("¡Tu destino ha sido sellado! 🌙 Orden creada con éxito.");
        router.push('/orders');
    } catch (err: any) {
        if (err?.response?.status === 401 && err?.response?.status === 403) {
        toast.error("No fue posible completar la orden. Verifica tu destino.");
        }
    }
    };

  return (
    <RoleGate roles={["client", "seller", "admin"]}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 700, margin: "40px auto" }}>
        <h1 className="vr-title" style={{ textAlign: "center" }}>Tu Carrito</h1>

        {cart.items.length === 0 && (
          <p style={{ textAlign: "center", marginTop: 20 }}>Tu destino espera... pero tu carrito está vacío 🌙</p>
        )}

        {cart.items.map((item: any) => (
          <div key={item.id} className="vr-card" style={{ marginTop: 14 }}>
            {item.product.productUrl && (
            <img
                src={item.product.productUrl}
                alt={item.product.name}
                style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 8,
                }}
            />
            )}
            <strong>{item.product.name}</strong>
            <div>Precio: ${item.product.price_cents.toLocaleString('es-CO')}</div>

            <input
              type="number"
              min={1}
              value={item.quantity}
              className="vr-input"
              style={{ width: 60, marginTop: 6 }}
              onChange={(e) => updateCartItem(item.id, Number(e.target.value)).then(refresh)}
            />

            <button
              className="vr-btn"
              style={{ background: "rgba(226,77,77,0.2)", marginTop: 8 }}
              onClick={() => removeCartItem(item.id).then(refresh)}
            >
              Quitar
            </button>
          </div>
        ))}

        <hr style={{ margin: "16px 0", borderColor: "rgba(212,175,55,0.3)" }} />
        <h2 className="vr-title" style={{ textAlign: "right" }}>
            Total: ${total.toLocaleString('es-CO')}
            </h2>


        <button
          className="vr-btn"
          style={{ width: "100%", marginTop: 16 }}
          onClick={() => clearCart().then(refresh)}
        >
          Vaciar carrito
        </button>

    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
    <button
        className="vr-btn"
        onClick={handleCheckout}
        style={{ padding: "10px 24px" }}
    >
        Finalizar compra ✨
    </button>
    </div>



      </motion.div>
    </RoleGate>
  );
}
