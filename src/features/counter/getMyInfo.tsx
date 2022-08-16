import { createSlice } from "@reduxjs/toolkit";
import { getImpliedNodeFormatForFile } from "typescript";

interface CounterState {
    lastName: String,
    firstName: String,
    birthday: String,
    gender: String,
    email: String,
    address: String,
    phoneNumber: String
}

const initialState: CounterState = {
    lastName: "",
    firstName: "",
    birthday: "",
    gender: "",
    email: "",
    address: "",
    phoneNumber: ""
}

export const counterSlice = createSlice({
    name: "getInfo",
    initialState,
    reducers: {
        setLastName: (state, action) => {
            state.lastName = action.payload;
        },
        setFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        setBirthday: (state, action) => {
            state.birthday = action.payload;
        },
        setGender: (state, action) => {
            state.gender = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setAddress: (state, action) => {
            state.address = action.payload;
        },
        setPhoneNumber: (state, action) => {
            state.phoneNumber = action.payload;
        }
    }
})

export const { setLastName, setFirstName, setBirthday, setGender, setEmail, setAddress, setPhoneNumber } = counterSlice.actions;

export const selectLastName = (state: any) => state.getInfo.lastName
export const selectFirstName = (state: any) => state.getInfo.firstName
export const selectBirthday = (state: any) => state.getInfo.birthday
export const selectGender = (state: any) => state.getInfo.gender
export const selectEmail = (state: any) => state.getInfo.email
export const selectAddress = (state: any) => state.getInfo.address
export const selectPhoneNumber = (state: any) => state.getInfo.phoneNumber

export default counterSlice.reducer