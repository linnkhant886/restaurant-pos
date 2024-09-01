export function Topbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#E63946",
        color: "#F1FAEE",
        height: "65px",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <h2>Foodie POS</h2>
      <h2>Sanchaung</h2>
      <h2 style={{ cursor: "pointer" }}>Logout</h2>
    </div>
  );
}
