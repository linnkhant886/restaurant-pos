import { getLocation, getSelectedLocation } from "@/libs/action";
import LogoutButton from "./LogoutButton";
export async function Topbar() {
  const location = await getLocation();
  const selectedLocation = await getSelectedLocation();

  const Selected = location.find(
    (item) => item.id === selectedLocation?.locationId
  );
  
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
      <h2>{Selected?.name}</h2>
      <LogoutButton />
    </div>
  );
}
