import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'userState',
    initialState: {
        email: '',
        name: '',
        id: ''
    },
    reducers: {
        setUser: (state, {payload}) => {
            const {email, name, sub} = payload;
            state.email = email;
            state.name = name;
            state.id = sub;
        },
    },
});

export const {setUser} = userSlice.actions;

export default userSlice.reducer;