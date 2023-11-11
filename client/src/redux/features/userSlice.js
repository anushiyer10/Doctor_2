import {createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user:null,
    },
    reducers:{
        setuser: (state,action) => {
            state.user = action.payload;
        },
    },
});

export const {setUser} = createSlice.actions;