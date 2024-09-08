import {createSlice} from "@reduxjs/toolkit";


export const labelSlice = createSlice({
    name: 'label',
    initialState: {
        hoveredItem: {},
        hiddenItems: [],
    },
    reducers: {
        setHoveredItem: (state, {payload}) => {
            state.hoveredItem = payload;
        },
        clearHoveredItem: (state => {
            state.hoveredItem = {};
        }),
        setHiddenItems: (state, {payload}) => {
            state.hiddenItems = payload;
        },
        addHiddenItems: (state, {payload}) => {
            state.hiddenItems = [...payload, ...state.hiddenItems];
        },
        clearHiddenItems: (state, {payload}) => {
            state.hiddenItems = state.hiddenItems.filter(item => !payload.includes(item));
        },
        clearAllHiddenItems: (state, {payload}) => {
            state.hiddenItems = [];
        }
    }
});

export const {setHoveredItem, clearHoveredItem, addHiddenItems, clearHiddenItems, clearAllHiddenItems} = labelSlice.actions;

export default labelSlice.reducer;