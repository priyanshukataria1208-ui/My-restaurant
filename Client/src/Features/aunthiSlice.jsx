import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_V1_URL } from "../lib/config";

// LOGIN
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API_V1_URL}/login`, data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Login Failed"
    );
  }
});

// REGISTER
export const Register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${API_V1_URL}/register`, data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Register Failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    name: localStorage.getItem("name") || null,
    email: localStorage.getItem("email") || null,
    role: localStorage.getItem("role") || null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  },
  reducers: {
    logOut: (state) => {
      state.name = null;
      state.email = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("name", action.payload.name);
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(Register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(Register.rejected, (state, action) => {
        state.loading = false;
        
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
export const { logOut } = authSlice.actions;
