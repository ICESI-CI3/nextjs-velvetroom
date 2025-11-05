/* eslint-disable @typescript-eslint/no-explicit-any */
export default function OrderStatusBadge({ status }: { status: string }) {
  const map: any = {
    pending:  { text: "El contrato está siendo preparado…", icon: "✒️", color: "#4ea0ff" },
    paid:     { text: "La Luna ha aceptado tu ofrenda…",   icon: "🌙", color: "#ca9df7" },
    shipped:  { text: "El mensajero del destino ha partido…", icon: "📦", color: "#d4af37" },
    completed:{ text: "El destino ha sido sellado.",       icon: "🔮", color: "#6fffd7" },
    cancelled:{ text: "El pacto ha sido deshecho.",        icon: "🥀", color: "#e96a6a" },
  };

  const s = map[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 6,
        background: `${s.color}22`,
        border: `1px solid ${s.color}66`,
        color: s.color,
        fontWeight: 600,
      }}
    >
      {s.icon} {s.text}
    </span>
  );
}
