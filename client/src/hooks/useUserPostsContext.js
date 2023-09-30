import { PostsContext } from "../context/PostContext";
import { useContext } from "react"
import { UserPostsContext } from "../context/UserPostsContext";

export const useUserPostsContext = () =>{
    const context = useContext(UserPostsContext);

    
    if(!context){
        throw Error("usePostsContext must be used inside an PostsContextProvider");
    }

    return context;
}