import axios from "axios";
import  { createContext, useEffect, useReducer } from "react";
import { useActiveUserContext } from "./activeUserContext";

export const FavContext = createContext();

export const favReducer = (state, action) =>{

    switch(action.type){
  

        case "CREATE_FAV":
            return{
                favItems : action.payload
            }

        case "UPDATE_FAV":
            return{
                favItems : state.favItems.map((item) => {

                    if(item._id === action.payload._id){
                        return action.payload;
                    }

                    return item;
                })
            }

        case "DELETE_FAV":
            return{
                favItems : state.favItems.filter((item)=> item._id !== action.payload._id)
            }

        

        default : 
            return state
    }

}

export const FavContextProvider = ({ children }) => {
  const initialFavItems = JSON.parse(localStorage.getItem("favItems")) || [];
  const { activeUser } = useActiveUserContext();

  const [state, dispatch] = useReducer(favReducer, {
    favItems: initialFavItems,
  });

    useEffect(() => {
      localStorage.setItem("favItems", JSON.stringify(state.favItems));
    }, [state.favItems]);

    useEffect(() => {
      const fetchFav = async () => {
        try {
          // Sepet bilgisini almak için HTTP isteği yapın
          const res = await axios.get(`/api/auth/user/${activeUser._id}/favItems`);
          dispatch({ type: 'CREATE_FAV', payload: res.data.favItems });
        } catch (error) {
          console.error('Error fetching fav items:', error);
        }
      };
  
      if (activeUser) {
        fetchFav();
      }
    }, [activeUser]);

    const addToFav = (item) => {
      dispatch({ type: "CREATE_FAV", payload: item });
    };
    

    const removeFromFav = (item) => {
      dispatch({ type: "DELETE_FAV", payload: item });
    };


    return (
        <FavContext.Provider value={{...state, dispatch,addToFav,removeFromFav}}>
            { children }
        </FavContext.Provider>
    )
}

