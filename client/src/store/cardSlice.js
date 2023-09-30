// import { createSlice } from '@reduxjs/toolkit';

// const cardSlice = createSlice({
//   name: 'cart',
//   initialState: {
//     items: [],
//     count: 0,
//   },
//   reducers: {
//     addToCart: (state, action) => {
//       state.items.push(action.payload);
//       state.count = state.items.length;
//       localStorage.setItem('cartItems', JSON.stringify(state.items));
//     },
//     removeFromCart: (state, action) => {
//       state.items = state.items.filter(item => item.id !== action.payload);
//       state.count = state.items.length;
//       localStorage.setItem('cartItems', JSON.stringify(state.items));
//     },
//     initializeCartFromStorage: (state) => {
//       const storedItems = localStorage.getItem('cartItems');
//       if (storedItems) {
//         state.items = JSON.parse(storedItems);
//         state.count = state.items.length;
//       }
//     },
//   },
// });

// export const { addToCart, removeFromCart, initializeCartFromStorage,items,count } = cardSlice.actions;
// export default cardSlice.reducer;