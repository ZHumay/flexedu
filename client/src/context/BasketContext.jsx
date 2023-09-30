import axios from "axios";
import  { createContext, useEffect, useReducer } from "react";
import { useActiveUserContext } from "./activeUserContext";

export const BasketContext = createContext();

export const basketReducer = (state, action) =>{

    switch(action.type){
        // case "SET_BASKET":
        //     return{
        //         basketItems : action.payload
        //     }

        case "CREATE_BASKET":
            return{
                basketItems : action.payload
            }

        case "UPDATE_BASKET":
            return{
                basketItems : state.basketItems.map((item) => {

                    if(item._id === action.payload._id){
                        return action.payload;
                    }

                    return item;
                })
            }

        case "DELETE_BASKET":
            return{
                basketItems : state.basketItems.filter((item)=> item._id !== action.payload._id)
            }

        

        default : 
            return state
    }

}

export const BasketContextProvider = ({ children }) => {

  const initialBasketItems = JSON.parse(localStorage.getItem("basketItems")) || [];
  const { activeUser } = useActiveUserContext();


    const [state, dispatch] = useReducer(basketReducer, {
      basketItems: initialBasketItems,    })

    useEffect(() => {
      localStorage.setItem("basketItems", JSON.stringify(state.basketItems));
    }, [state.basketItems]);

    useEffect(() => {
      const fetchBasket = async () => {
        try {
          // Sepet bilgisini almak için HTTP isteği yapın
          const res = await axios.get(`/api/auth/user/${activeUser._id}/basketItems`);
          dispatch({ type: 'CREATE_BASKET', payload: res.data.basketItems });
        } catch (error) {
          console.error('Error fetching basket items:', error);
        }
      };
  
      if (activeUser) {
        fetchBasket();
      }
    }, [activeUser]);

    const addToBasket = (item) => {
      dispatch({ type: "CREATE_BASKET", payload: item });
    };
    

    const removeFromBasket = (item) => {
      dispatch({ type: "DELETE_BASKET", payload: item });
    };
    const total =()=>{
      let totalPrice = 0;
    
        state.basketItems.forEach((item) => {
          totalPrice += item.price;
        });
    
        return totalPrice;
     }

    return (
        <BasketContext.Provider value={{...state, dispatch,addToBasket,removeFromBasket,total}}>
            { children }
        </BasketContext.Provider>
    )
}

