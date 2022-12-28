import { createSlice } from "@reduxjs/toolkit";

interface IProps {
  isSidebarOpen: boolean;
}

const initialState: IProps = {
  isSidebarOpen: false,
};

export const postSlice = createSlice({
  name: "counter",

  initialState,
  reducers: {
    openSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { openSidebar } = postSlice.actions;

export default postSlice.reducer;
