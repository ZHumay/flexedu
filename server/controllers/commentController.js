const commentModel = require("../models/commentModel");

const post_comment = async (req, res) =>{
    try{
        const comment = await commentModel.create({
            postId : req.body.postId,
            authorId : req.params.id,
            comment : req.body.comment
        })

        if(comment){
            res.status(200).json({msg : "Comment Posted Successfully !!", comment : comment})
        }
        else{
            res.json({msg : "Comment not posted"})
        }

    }
    catch(error){
        console.log(error.message); 
        res.json({msg : error.message})
    }
}


const delete_comment = async (req, res) =>{
    try{
        const comment = await commentModel.findByIdAndDelete(req.params.id);

        if(comment){
            res.status(200).json({msg : "comment deleted successfully", comment : comment});
        }
        else{
            res.json({msg : "Comment not deleted"})
        }

    }catch(error){
        console.log(error.message);
        res.json({msg : "comment not deleted"})
    }
}


const all_comments = async (req, res) =>{
   try{
    const comments = await commentModel.find();

    if(comments)
    {
        res.status(200).json({comments : comments})
    }
    else{
        res.json({msg : "Comment not found"})
    }

   }catch(error){
console.log(error.message);
res.json({msg:"Comments not found"});
   }
}


module.exports = {
    post_comment,
    delete_comment,
    all_comments
}