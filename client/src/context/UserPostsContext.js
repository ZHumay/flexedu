import  { createContext, useReducer } from "react";

export const UserPostsContext = createContext();

export const userpostsReducer = (state, action) =>{

    switch(action.type){
        case "SET_POSTS_USER":
            return{
                posts : action.payload
            }

        case "CREATE_POST_USER":
            return{
                posts : [ ...state.posts, action.payload]
            }

        case "UPDATE_POST_USER":
            return{
                posts : state.posts.map((post) => {

                    if(post._id === action.payload._id){
                        return action.payload;
                    }

                    return post;
                })
            }

        case "DELETE_POST_USER":
            return{
                posts : state.posts.filter((post)=> post._id !== action.payload._id)
            }

        

        default : 
            return state
    }

}

export const UserPostsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(userpostsReducer, {
        posts : []
    })


    return (
        <UserPostsContext.Provider value={{...state, dispatch}}>
            { children }
        </UserPostsContext.Provider>
    )
}

