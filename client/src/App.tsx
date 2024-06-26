import React, { useEffect, useState } from "react";
import "./App.css";
import DonationsList from "./components/DonationsList";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Donation from "./components/Donation";
import CreateDonation from "./components/CreateDonation";
import ConnectWallet from "./components/ConnectWallet";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  checkConnectedAccounts,
  walletConnection,
} from "./features/wallet/walletSlice";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import { getReceiverNotifications } from "./features/notification/notificationSlice";

declare var window: any;

function App() {
  const { connected } = useAppSelector((store) => store.wallet);
  const { donations } = useAppSelector((store) => store.donation);
  console.log(donations);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [changed, setChanged] = useState<boolean>(true);
  const { address } = useAppSelector((store) => store.wallet);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      localStorage.getItem("mode") &&
      localStorage.getItem("mode") === "light"
    ) {
      document.getElementsByTagName("body")[0].style.backgroundColor = "#FFF";
      setDarkMode(false);
    } else {
      document.getElementsByTagName("body")[0].style.backgroundColor =
        "#121212";
      setDarkMode(true);
    }

    if (window.ethereum) {
      dispatch(checkConnectedAccounts());

      if (connected) {
        dispatch(walletConnection());
        address && dispatch(getReceiverNotifications(address.toLowerCase()));
      }

      window.ethereum.on("chainChanged", () => {
        setChanged(!changed);
      });

      window.ethereum.on("accountsChanged", () => {
        setChanged(!changed);
      });
    }
  }, [darkMode, changed, dispatch, connected, address]);

  if (!connected) {
    return <ConnectWallet />;
  }

  return (
    <div className={`bg-[${darkMode ? "#121212" : "#FFF"}]`}>
      <Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
      <Routes>
        <Route path="/" element={<DonationsList darkMode={darkMode} />} />

        <Route
          path="/donation/:id"
          element={<Donation darkMode={darkMode} />}
        />

        <Route
          path="/create"
          element={<CreateDonation darkMode={darkMode} />}
        />

        <Route path="/profile" element={<Profile darkMode={darkMode} />} />

        <Route
          path="/notifications"
          element={<Notifications darkMode={darkMode} />}
        />
      </Routes>
    </div>
  );
}

export default App;
