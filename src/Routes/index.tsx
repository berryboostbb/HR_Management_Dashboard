import { useSelector } from "react-redux";
import AuthRoutes from "./authRoutes";
import Pages from "../pages";

function Routes() {
  const userState = useSelector((state: any) => state.user);

  const isLoggedIn = userState?.isLoggedIn;

  if (!isLoggedIn) {
    return <AuthRoutes />;
  }

  return <Pages />;
}

export default Routes;
