import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FirebaseUserInfo {
  email: string;
}
export interface AuthState {
  value: boolean;
  tab: string;
  user: FirebaseUserInfo;
  username: string;
}

const initialState: AuthState = {
  value: false,
  tab: "home",
  user: { email: "" } as FirebaseUserInfo,
  username: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = true;
    },
    setUnAuth: (state) => {
      state.value = false;
    },
    setTab: (state, action: PayloadAction<string>) => {
      state.tab = action.payload;
    },
    setUser: (state, action: PayloadAction<FirebaseUserInfo>) => {
      state.user = action.payload;
    },
    setGUserName: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuth, setUnAuth, setTab, setUser, setGUserName } =
  authSlice.actions;

export default authSlice.reducer;
