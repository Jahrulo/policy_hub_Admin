import SideBar from "./SideBar";
import Header from "./Header";
import { Link, Outlet } from "react-router-dom";
import Menu from "./Menu";

function AppLayout() {
  return (
    <div className="h-screen flex overflow-hidden">
      <div className="w-[18%] md:w-[10%] lg:w-[19%] xl:w-[18%] p-4 flex-shrink-0 overflow-y-auto scrollbar-hide bg-bgSecondary m-4 rounded-md">
        <Link
          href={"/"}
          className="flex flex-col items-center gap-2 justify-center lg:justify-start"
        >
          <img
            src="/mohs.svg"
            width={30}
            height={30}
            alt="feed salone logo"
            className="w-[50%] h-[50%]"
          />
        </Link>
        <Menu />
      </div>

      <div className="flex-1 overflow-auto w-1/10">
        <Header />

        <main className="font-bold  text-xl w-1/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
