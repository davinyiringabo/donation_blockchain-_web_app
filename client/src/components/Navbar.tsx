import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/donate-logo.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const Navbar: React.FC<{
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
}> = ({ setDarkMode, darkMode }) => {
  const { notifications } = useAppSelector((store) => store.notifications);
  const [openNavbar, setOpenNavbar] = useState<boolean>(false);
  const navRef = useRef<any>();
  const navigate = useNavigate();
  useEffect(() => {
    const handleClose = (e: any) => {
      if (navRef && !navRef.current.contains(e.target)) {
        setOpenNavbar(false);
      }
    };

    document.addEventListener("mousedown", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  const handleNavigate = (to: string) => {
    setOpenNavbar(false);
    navigate(to);
  };

  const handleChangeMode = () => {
    if (darkMode) {
      setDarkMode(false);
      localStorage.setItem("mode", "light");
    } else {
      setDarkMode(true);
      localStorage.setItem("mode", "dark");
    }
  };

  return (
    <div
      className={`fixed top-0 flex justify-center items-center border-b-[1px] border-[${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)"}] w-full ${darkMode ? "bg-[#121212]" : "bg-white"} z-50`}
    >
      <div
        className={`
                    relative h-full flex md:items-center
                    w-[100%] md:w-[90%]  md:flex-row flex-col`}
        ref={navRef}
      >
        <div className="flex items-center">
          <div className="w-16 h-16 flex justify-center items-center cursor-pointer">
            <h1
              className={`logo_name font-extrabold ${!darkMode ? "text-black" : "text-white"}`}
            >
              Donationia
            </h1>
          </div>

          <div
            className="flex justify-center items-center md:hidden p-[5px] absolute right-0"
            onClick={() => setOpenNavbar(!openNavbar)}
          >
            {!openNavbar ? (
              <MenuIcon
                className={`${darkMode ? "text-white" : "text-[#121212]"} cursor-pointer`}
              />
            ) : (
              <CloseIcon
                className={`${darkMode ? "text-white" : "text-[#121212]"} cursor-pointer`}
              />
            )}
          </div>
        </div>
        <div
          className={`md:ml-auto p-[5px] h-full md:flex md:flex-row flex-col justify-center items-center ${!openNavbar ? "hidden" : "block"}`}
        >
          <div className="flex gap-x-[5px] mr-6 md:mb-0 mb-[25px]">
            <button
              className={`p-[5px] rounded-[8px] disabled:opacity-50`}
              onClick={handleChangeMode}
            >
              {darkMode ? (
                <LightModeIcon className="text-amber-300" />
              ) : (
                <DarkModeIcon className="text-[#121212]" />
              )}
            </button>
          </div>

          <div
            className={`
                        flex items-center md:mb-0 mb-[10px] md:w-max w-[150px] 
                        cursor-pointer mr-2 p-[5px] rounded-[8px] border
                        ${darkMode ? "bg-white" : ""}
                        hover:bg-gray-200
                        `}
            onClick={() => handleNavigate("/")}
          >
            <HomeIcon className="mr-2 md:mr-0" />

            <span className="md:hidden">Home</span>
          </div>

          <div
            className={`
                        relative flex items-center md:mb-0 mb-[10px] md:w-max w-[150px] 
                        cursor-pointer mr-2 p-[5px] rounded-[8px] border
                        ${darkMode ? "bg-white" : ""}
                        hover:bg-gray-200
                        `}
            onClick={() => handleNavigate("/profile")}
          >
            <PersonIcon className="mr-2 md:mr-0" />

            <span className="md:hidden">Profile</span>
          </div>

          <button
            className="
                        flex items-center justify-center 
                        md:w-max w-[150px] md:mb-0 mb-[10px] text-white 
                        bg-purple-700 p-[5px] border border-purple-700 
                        rounded-[8px] hover:bg-purple-500 hover:border-purple-500"
            onClick={() => handleNavigate("/create")}
          >
            Create donation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
