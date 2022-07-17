import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  title: string;
  content: string;
  author: string;
  photo: string;
}

const initialState: CounterState = {
  title: "",
  content: "",
  author: "",
  photo: "",
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setAuthor: (state, action) => {
      state.author = action.payload;
    },
    setPhoto: (state, action) => {
      state.photo = action.payload;
    },
  },
});

export const { setTitle, setContent, setAuthor, setPhoto } =
  counterSlice.actions;

export const selectTitle = (state: any) => state.counter.title;
export const selectContent = (state: any) => state.counter.content;
export const selectAuthor = (state: any) => state.counter.author;
export const selectPhoto = (state: any) => state.counter.photo;

export default counterSlice.reducer;
