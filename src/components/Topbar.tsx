import { getLocation } from '@/libs/action';
import LogoutButton from './LogoutButton'
export async function Topbar() {
  const location = await getLocation();
  console.log(location)
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
      <h2>{location[0].name}</h2>
      <LogoutButton />
    </div>
  );
}
