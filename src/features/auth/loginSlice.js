import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios } from "../../index.js";

// Async Thunk for user login
export const loginUser = createAsyncThunk(
    "login/user", // Action type prefix
    async ({ email, password }, { rejectWithValue }) => {
        try {

            console.log("Sending credentials:", email, password);

            const response = await axios.post('/login', { email, password });
            console.log("Login response:", response.data);

            const { user, token } = response.data.data

            // Store token in localStorage
            localStorage.setItem("token", token);

            return { user, token }
        } catch (error) {
            const message =
                error.response?.data?.message || "Login failed. Please try again.";
            return rejectWithValue(message);
        }
    }
);

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null
};

// Slice
const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
        setUserFromToken: (state, action) => {
            state.user = action.payload;
            state.token = localStorage.getItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            });
    }
});

// Export actions and reducer
export const { logout, setUserFromToken } = loginSlice.actions;
export default loginSlice.reducer;
