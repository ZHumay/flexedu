const cloudinary = require("cloudinary").v2;
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const Rating = require("../models/ratingModel");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const create_post = async (req, res) => {
  try {
    const file = req.files.blogImage;

    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      try {
        if (result) {
          const post = new postModel({
            title: req.body.title,
            color: req.body.color,
            price: req.body.price,
            size:req.body.size,
            description: req.body.description,
            category: req.body.category,
            gender:req.body.gender,
            authorId : req.body.activeUserId,
            postImage: result.url,
            userType: "user"
          });

          const savePost = await post.save();

          if (savePost) {
            res
              .status(200)
              .json({ post: savePost, msg: "Product created successfully !!" });

          } else {
            res.json({ msg: "Something wents wrong" });
          }
        } else {
          console.log(err);
          res.json({ msg: err });
        }
      } catch (error) {
        res.json({ msg: error.message });
      }
    });
  } catch (error) {
    console.log(error);
  }
};


const create_post_admin = async (req, res) => {
  try {
    const file = req.files.blogImage;

    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      try {
        if (result) {
          const post_admin = new postModel({
            title: req.body.title,
            color: req.body.color,
            price: req.body.price,
            size:req.body.size,
            description: req.body.description,
            category: req.body.category,
            gender:req.body.gender,
            authorId : req.body.activeUserId,
            postImage: result.url,
            userType: "admin"
          });

          const savePost = await post_admin.save();

          if (savePost) {
            res
              .status(200)
              .json({ post: savePost, msg: "Product created successfully !!" });

          } else {
            res.json({ msg: "Something wents wrong" });
          }
        } else {
          console.log(err);
          res.json({ msg: err });
        }
      } catch (error) {
        res.json({ msg: error.message });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const get_post = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await postModel.findById(id);

    if (post) {
      // Normal kullanıcılar için ilgili işlemler
      res.status(200).json({ post: post });
    } else {
      res.json({ msg: "Post not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ msg: error.message });
  }
};

const get_post_admin = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await postModel.findById(id);

    if (post) {
      // Yöneticiler için ilgili işlemler
      res.status(200).json({ post: post });
    } else {
      res.json({ msg: "Post not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ msg: error.message });
  }
};


const get_allcount = async (req, res) => {
  try {
    const posts = await postModel.find({}, '_id productcountinbasket');

    if (posts) {
      const counts = posts.map(post => ({
        _id: post._id,
        productcountinbasket: post.productcountinbasket
      }));

      res.status(200).json(counts);
    } else {
      res.json({ msg: "No posts found" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ msg: "Error fetching data" });
  }
};


const incrementOrderedCount = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('Incrementing ordered count for post:', post);

    post.productcountinbasket += 1; // Increment orderedcount by 1
    await post.save();
    
    console.log('Updated post:', post);

    res.json({ success: true, message: 'Ordered count incremented successfully' });
  } catch (error) {
    console.error('Error incrementing ordered count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const decrementOrderedCount = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.productcountinbasket > 0) {
      post.productcountinbasket -= 1; // Decrement orderedcount by 1
      await post.save();
      res.json({ success: true, message: 'Ordered count decremented successfully' });
    } else {
      res.json({ success: false, message: 'Ordered count is already 0' });
    }
  } catch (error) {
    console.error('Error decrementing ordered count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const get_productcountinbasket = async (req, res) => {
  const postId = req.params.id; // Assuming you're passing the post ID in the URL

  try {
    const post = await postModel.findById(postId);

    if (post) {
      const productcountinbasket = post.productcountinbasket;
      res.status(200).json({ productcountinbasket });
    } else {
      res.status(404).json({ msg: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};



const all_posts = async (req, res) => {
  try {
    const posts = await postModel.find({ userType: "user" }); // Filter posts created by regular users

    if (posts) {
      res.status(200).json({ msg: "Data fetched successfully", posts: posts });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ msg: "Data can't fetch" });
  }
};

const all_posts_fromAdmin = async (req, res) => {
  try {
    const posts = await postModel.find({ userType: "admin" }).populate("ratings");

    if (posts) {
      const postsWithAverageRating = posts.map((post) => {
        // Check if the 'ratings' property exists and is an array
        if (post.ratings && Array.isArray(post.ratings) && post.ratings.length > 0) {
          const totalRating = post.ratings.reduce((sum, rating) => sum + rating.rating, 0);
          const averageRating = totalRating / post.ratings.length;

          return {
            ...post._doc,
            averageRating,
          };
        } else {
          // If 'ratings' is undefined, an empty array, or has no items, set averageRating to 0
          return {
            ...post._doc,
            averageRating: 0,
          };
        }
      });

      res.status(200).json({
        msg: "Data fetched successfully",
        posts: postsWithAverageRating,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ msg: "Data can't fetch" });
  }
};



const update_post = async (req, res) => {
  try {
    if (req.files) {
      // Handle image upload if there is a new image
      const file = req.files.blogImage;
      cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        try {
          if (result) {
            // Update post with the new image URL
            const updatedPost = {
              title: req.body.title,
              color: req.body.color,
              price: req.body.price,
              size: req.body.size,
              description: req.body.description,
              category: req.body.category,
              gender:req.body.gender,
              authorId: req.body.activeUserId,
              postImage: result.url,
            };

            const post = await postModel.findByIdAndUpdate(req.params.id, updatedPost);

            if (post) {
              res.status(200).json({ msg: "Product updated successfully", post: post });
            
            } else {
              res.json({ msg: "Post not updated, Something went wrong" });
            }
          } else {
            console.log(err);
            res.json({ msg: err });
          }
        } catch (error) {
          res.json({ msg: error.message });
        }
      });
    } else {
      // Update post without uploading a new image
      const updatedPost = {
        title: req.body.title,
        color: req.body.color,
        price: req.body.price,
        size: req.body.size,
        description: req.body.description,
        category: req.body.category,
        gender:req.body.gender,
        authorId: req.body.activeUserId,
      };

      const post = await postModel.findByIdAndUpdate(req.params.id, updatedPost);

      if (post) {
        res.status(200).json({ msg: "Product updated successfully", post: post });
      } else {
        res.json({ msg: "Post not updated, Something went wrong" });
      }
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const delete_post = async (req, res) => {
  try{
    const deletePost = await postModel.findByIdAndDelete(req.params.id);

    if(deletePost){
      res.status(200).json({msg : "Post deleted Successfully", post : deletePost});
    }
    else{
      res.json({msg : "Post not deleted"})
    }

  }catch(error){
     console.log(error.message);
     res.json({msg : "Post not deleted"});
  }
};

const update_post_admin = async (req, res) => {
  try {
    if (req.files) {
      // Handle image upload if there is a new image
      const file = req.files.blogImage;
      cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        try {
          if (result) {
            // Update post with the new image URL
            const updatedPost = {
              title: req.body.title,
              color: req.body.color,
              price: req.body.price,
              size: req.body.size,
              description: req.body.description,
              category: req.body.category,
              gender:req.body.gender,
              authorId: req.body.activeUserId,
              postImage: result.url,
            };

            const post = await postModel.findByIdAndUpdate(req.params.id, updatedPost);

            if (post) {
              res.status(200).json({ msg: "Product updated successfully", post: post });
            
            } else {
              res.json({ msg: "Post not updated, Something went wrong" });
            }
          } else {
            console.log(err);
            res.json({ msg: err });
          }
        } catch (error) {
          res.json({ msg: error.message });
        }
      });
    } else {
      // Update post without uploading a new image
      const updatedPost = {
        title: req.body.title,
        color: req.body.color,
        price: req.body.price,
        size: req.body.size,
        description: req.body.description,
        category: req.body.category,
        gender:req.body.gender,
        authorId: req.body.activeUserId,
      };

      const post = await postModel.findByIdAndUpdate(req.params.id, updatedPost);

      if (post) {
        res.status(200).json({ msg: "Product updated successfully", post: post });
      } else {
        res.json({ msg: "Post not updated, Something went wrong" });
      }
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const delete_post_admin = async (req, res) => {
  try{
    const deletePost = await postModel.findByIdAndDelete(req.params.id);

    if(deletePost){
      res.status(200).json({msg : "Post deleted Successfully", post : deletePost});
    }
    else{
      res.json({msg : "Post not deleted"})
    }

  }catch(error){
     console.log(error.message);
     res.json({msg : "Post not deleted"});
  }
};


const like_dislike = async (req, res) =>{
  try{
    const postId = req.params.id;
    const userId = req.body.userId;

    const post = await postModel.findById(postId);

    if(post){
      
      if(!post.likes.includes(userId)){
        await postModel.updateOne({_id : postId}, {$push : { likes : userId}});
        res.status(200).json({msg : "Post has been liked", liked : true})
      }
      else{
        await postModel.updateOne({ _id : postId },{ $pull: { likes : userId }});
        res.status(200).json({msg : "Post has been disliked", liked : false});
        console.log("Post has been disliked");
      }
    }
    else{
      res.json({msg : "Something wents wrong", liked : false});
    }

  }
  catch(error){
    res.json({msg : error.message, liked : false});
  }
}



module.exports = {
  create_post,
  get_post,
  all_posts,
  update_post,
  delete_post,
  like_dislike,
  incrementOrderedCount,
  decrementOrderedCount,
  get_productcountinbasket,
  get_allcount,
  create_post_admin,
  get_post_admin,
  all_posts_fromAdmin,
  update_post_admin,
  delete_post_admin,

};
