import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Donation, DonationInitialState } from "./Donation";
import { ethers } from "ethers";

declare var window: any;

const connectSmartContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const DonationType = `(address owner, string title, string story, uint256 goal, uint256 deadline, uint256 collectedAmount, string image, address[] donators , uint256[] donations)`;

  const ABI = [
    "function getNumberOfDonations() public view returns (uint256)",
    `function createDonation(
        address _owner,
        string _title,
        string _story,
        uint256 _goal,
        uint256 _deadline,
        string _image
    ) public returns (uint256)`,
    "function donateToDonation(uint256 _id) public payable",
    "function getDonators(uint256 _id) returns (address[], uint256[])",
    `function getAllDonations() public view returns (${DonationType} [])`,
  ];

  const contract = new ethers.Contract(
    "0x2232aC1F3Bf11C1fAeeA4cD917291B4fBbCAB3b6",
    ABI,
    provider.getSigner(),
  );

  return contract;
};

export const getDonations = createAsyncThunk("donation/getAll", async () => {
  const contract = await connectSmartContract();
  const data = await contract.getAllDonations();
  return data;
});

export const saveDonation = createAsyncThunk(
  "donation/save",
  async (data: Donation) => {
    const { owner, title, story, goal, deadline, image } = data;
    const contract = await connectSmartContract();
    const weiValue = ethers.utils.parseEther(goal.toString());
    const transaction = await contract.createDonation(
      owner,
      title,
      story,
      weiValue,
      deadline,
      image,
    );
    await transaction.wait();
    return data;
  },
);

export const donate = createAsyncThunk(
  "donation/donate",
  async (data: { id: number; amount: string }) => {
    const { id, amount } = data;
    const contract = await connectSmartContract();
    const transaction = await contract.donateToDonation(id, {
      value: ethers.utils.parseEther(amount),
    });
    await transaction.wait();
    return data;
  },
);

const initialState: DonationInitialState = {
  loading: false,
  donations: [],
  error: null,
  success: false,
};

const donationSlice = createSlice({
  name: "Donation",
  initialState,
  reducers: {
    resetState(state) {
      state.loading = false;
      state.donations = [];
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDonations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.donations = action.payload;
        state.error = null;
      })
      .addCase(getDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveDonation.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.donations.push(action.payload);
      })
      .addCase(saveDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
      })
      .addCase(donate.pending, (state) => {
        state.loading = true;
      })
      .addCase(donate.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(donate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
      });
  },
});

export const { resetState } = donationSlice.actions;
export default donationSlice.reducer;
