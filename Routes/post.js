const router = require('express').Router();
const Post = require('../models/post');

    // Create Post
    router.post("/", async function (req, res) {
        const newPost = new Post(req.body);

        try {
            const Post = await newPost.save();
            res.status(200).json(Post);

        } catch(error) {
            res.status(500).json(error);
        }
    });

    // Update Post
    router.put("/:id", async function (req, res) {
        // Validate posts
        try {
            const post = await Post.findById(req.params.id); 

            if (post.userId === req.body.userId) {
                await post.updateOne({ $set: req.body })
                res.status(200).json("Post has been updated successfully");
            } else {
                res.status(403).json("Action not allowed");
            };

        } catch (error) {
            res.status(500).json(error)
        };
    });

    // Delete Post
    router.delete("/:id", async function (req, res) {
      // Validate posts
      try {
        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {
          await post.deleteOne({ $set: req.body });
          res.status(200).json("Post has been deleted successfully");
        } else {
          res.status(403).json("Action not allowed");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    });

    // Like and dislike post 
    router.put("/:id/like", async function (req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if(!post.likes.includes(req.body.userId)) {
                await post.updateOne({$push: {likes: req.body.userId}});
                res.status(200).json("You liked a post");
            } else {
                await post.updateOne({$pull: { likes:req.body.userId }});
                res.status(200).json("Post has been disliked");
            };

        } catch (error) {
            res.status(500).json(error);
        };
    });

    // Fetch Posts
    router.get("/:id", async function (req, res) {
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json(post)

        } catch (error) {
            res.status(500).json(error);
        };
    });

    // Fetch Time line Posts
    router.get("/timeline/more", async function(req, res) {
        try {
            const isCurrentUser = await User.findById(req.body.userId);
            const posts = await Post.find({userId: isCurrentUser._id});
            const connectionPosts = await Promise.all(
                isCurrentUser.following.map((connectionId) => {
                    Post.find({ userId: connectionId });
                }));

            res.json(posts.concat(...connectionPosts));

        } catch (error) {
            res.status(500).json(error);
        };
    });

module.exports = router;