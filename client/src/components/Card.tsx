import { ethers } from "ethers";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Donation } from "../features/donation/Donation";

const Card: React.FC<{
  darkMode: boolean;
  data: Donation;
  id: number;
}> = ({ darkMode, data, id }) => {
  const navigate = useNavigate();

  const hanldeNavigate = () => {
    navigate(`/donation/${id}`);
  };

  return (
    <div
      className={`flex min-h-[250px] bg-[${darkMode ? "#1c1c24" : "#FFF"}] rounded-[5px] shadow-xl cursor-pointer p-2`}
      onClick={hanldeNavigate}
    >
      <div className="w-full">
        <div className="mb-4">
          <img
            src={data.image}
            alt="img"
            className="rounded-tl-[16px] rounded-tr-[16px] object-cover w-full h-48 hover:opacity-75"
          />
        </div>

        <div className="p-[5px]">
          <div
            className={`sm:truncate md:truncate  mb-5 font-bold ${darkMode ? "text-white " : "text-[#121212]"}`}
          >
            {data.title}
          </div>

          <div
            className={`sm:truncate md:truncate mb-2 ${darkMode ? "text-gray-300" : "text-gray-500"}`}
          >
            {data.story}
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <div
                className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}
              >
                {ethers.utils.formatEther(data.collectedAmount)}
              </div>
              <div className="text-xs text-gray-500">
                Goal {ethers.utils.formatEther(data.goal)} Eth
              </div>
            </div>

            <div>
              {Math.ceil(
                (new Date(parseInt(data.deadline.toString(), 10)).getTime() -
                  new Date().getTime()) /
                  (1000 * 3600 * 24),
              ) >= 1 ? (
                <>
                  <div
                    className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}
                  >
                    {Math.ceil(
                      (new Date(
                        parseInt(data.deadline.toString(), 10),
                      ).getTime() -
                        new Date().getTime()) /
                        (1000 * 3600 * 24),
                    )}
                  </div>
                  <div className="text-xs text-gray-500">days left</div>
                </>
              ) : (
                <div className="text-red-400 text-xs">Ended</div>
              )}
            </div>
          </div>

          <div className="sm:truncate md:truncate text-center text-purple-700">
            <span
              className={`font-bold mr-1 ${darkMode ? "text-white" : "text-[#121212]"}`}
            >
              By
            </span>
            <span> {data.owner} </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
