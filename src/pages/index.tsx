import SearchBar from "../Components/SearchBar";
import SideBar from "../Components/SideBar";
import MainRoutes from "../Routes/mainRoutes";
import { defaultLinks } from "../utils/contant";

export default function Pages() {
  return (
    <div className="flex w-full min-h-screen gap-4 p-4">
      <SideBar link={defaultLinks} />
      <div className="w-full">
        <SearchBar />
        <div className="mt-4">
          <MainRoutes />
        </div>
      </div>
    </div>
  );
}
