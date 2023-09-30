import { useContext, createContext, useReducer, useEffect } from "react";

export const AdminContext = createContext();

export const adminReducer = (state, action) => {
  switch (action.type) {
    case "GET_ADMIN":
      return {
        admin: action.payload,
      };
    default:
      return state;
  }
};

export const useAdminContext = () => useContext(AdminContext);

export const AdminContextProvider = ({ children }) => {
  const [state, dispatchAdmin] = useReducer(adminReducer, {
    admin: JSON.parse(localStorage.getItem("admin")),
  });

  useEffect(() => {
    localStorage.setItem("admin", JSON.stringify(state.admin));
  }, [state.admin]);

  return (
    <AdminContext.Provider value={{ ...state, dispatchAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
