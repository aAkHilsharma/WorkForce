import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
    allUsers: [],
  },
  reducers: {
    SetUser(state, action) {
      state.user = action.payload;
    },
    SetAllUsers(state, action) {
      state.allUsers = action.payload;
    },
  },
});

export const { SetUser, SetAllUsers } = usersSlice.actions;
export default usersSlice.reducer;
