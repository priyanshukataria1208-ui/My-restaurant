import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_V1_URL } from "../lib/config";

const initialState = {
  sessionToken: null,
  loading: false,
  error: null,
  role: null,
};

// ✅ SESSION THUNK
export const session = createAsyncThunk(
  "guest/session",
  async (data, thunkApi) => {
    try {
      const res = await axios.post(
        `${API_V1_URL}/session`,
        data
      );
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Session failed"
      );
    }
  }
);

const guestSlice = createSlice({
  name: "guest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🔹 PENDING
      .addCase(session.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // 🔹 SUCCESS
      .addCase(session.fulfilled, (state, action) => {
        state.loading = false;

        const { sessionToken, role } = action.payload.data;

        state.sessionToken = sessionToken;
        state.role = role;

        // ✅ localStorage sync
        localStorage.setItem("sessionToken", sessionToken);
        localStorage.setItem("role", role);
      })

      // 🔹 FAILED
      .addCase(session.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default guestSlice.reducer;
