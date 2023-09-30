const router = require("express").Router();
const { create_post, get_post, all_posts, delete_post, update_post, like_dislike, incrementOrderedCount, decrementOrderedCount, get_productcountinbasket, get_allcount, create_post_admin, get_post_admin, all_posts_fromAdmin, delete_post_admin, update_post_admin, } = require("../controllers/postController");

router.post("/create-post", create_post);
router.post("/create-post/admin", create_post_admin);

router.get("/post/:id", get_post);
router.get("/post/admin/:id", get_post_admin);

router.get("/posts", all_posts);
router.get("/posts/admin", all_posts_fromAdmin);

router.delete("/delete-post/:id", delete_post);
router.delete("/delete-post/admin/:id", delete_post_admin);

router.patch("/update-post/:id", update_post)
router.patch("/update-post/admin/:id", update_post_admin)

router.post("/like-dislike/:id", like_dislike)
router.post('/post/:id/incrementOrderedCount', incrementOrderedCount);
router.post('/post/:id/decrementOrderedCount',decrementOrderedCount);
router.get("/post/:id/productcountinbasket", get_productcountinbasket);
router.get("/get-allcount", get_allcount);


module.exports = router;
