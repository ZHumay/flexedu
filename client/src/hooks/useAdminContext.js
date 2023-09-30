import { AdminContext } from "../context/AdminContext";
import { useContext } from "react";

export const useActiveUserContext = () =>{
  const context = useContext(AdminContext);

  if(!context){
    throw Error("useActiveUserContext must be inside inside ActiveUserContext");
  }

  return context;
}