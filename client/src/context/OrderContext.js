import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { useActiveUserContext } from "./activeUserContext";

export const OrderContext = createContext();

export const orderReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_ORDER":
      return {
        orders: action.payload,
      };

    // Diğer case'ler buraya eklenebilir

    default:
      return state;
  }
};

export const OrderContextProvider = ({ children }) => {
  const { activeUser } = useActiveUserContext();

  const [state, dispatch] = useReducer(orderReducer, {
    orders: [],
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (activeUser) {
          // Kullanıcının siparişlerini almak için HTTP isteği yapın
          const res = await axios.get(`/api/auth/user/${activeUser._id}/orderItems`);
          dispatch({ type: "CREATE_ORDER", payload: res.data.orderItems });
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [activeUser]);

  // Diğer fonksiyonlar ve işlevler buraya eklenebilir

  useEffect(() => {
    // Siparişleri localStorage'a kaydet
    localStorage.setItem("orders", JSON.stringify(state.orders));
  }, [state.orders]);
  

  const addOrder = (order) => {
    dispatch({ type: "CREATE_ORDER", payload: [...state.orders, order] });
  };

  const value = {
    orders: state.orders,
    addOrder,
    // Diğer değerler buraya eklenebilir
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
