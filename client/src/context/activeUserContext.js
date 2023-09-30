import { useContext, createContext, useReducer, useEffect } from "react";

export const ActiveUserContext = createContext();

export const activeUserReducer = (state, action) => {
  switch (action.type) {
    case "GET_ACTIVE_USER":
      return {
        activeUser: action.payload,
      };
    default:
      return state;
  }
};

export const useActiveUserContext = () => useContext(ActiveUserContext);

export const ActiveUserContextProvider = ({ children }) => {
  const [state, dispatchActiceUser] = useReducer(activeUserReducer, {
    activeUser: JSON.parse(localStorage.getItem("activeUser")) || null
  });

  useEffect(() => {
    localStorage.setItem("activeUser", JSON.stringify(state.activeUser));
  }, [state.activeUser]);

  return (
    <ActiveUserContext.Provider value={{ ...state, dispatchActiceUser }}>
      {children}
    </ActiveUserContext.Provider>
  );
};
