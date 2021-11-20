const router = require('express').Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

// Edit User
router.put("/:id", async function (req, res) {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(15);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            };
        };
        try {
            const user = await User.findByIdAndUpdate(req.body.userId, {
                $set: req.body,
            });
            res.status(200).json("Your account has been updated successfully");
        } catch (e) {
            return res.status(500).json(e);
        };

    } else {
        return res.status(403).json("Action not allowed.")
    };
});

// Remove User
router.delete("/:id", async function (req, res) {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Your account has been deleted successfully");
    } catch (e) {
      return res.status(500).json(e);
    }
  } else {
    return res.status(403).json("Action not allowed.");
  }
});

// Get User
router.get("/:id", async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        // Return specific user information
        const {password, updatedAt, createdAt, ...other} = user._doc
        res.status(200).json(other);
    } catch(error) {
        res.status(500).json(error);
    };
});

// Follow User
router.put("/:id/follow", async function (req, res) {
    // Validate user id
    if(req.body.userId !== req.params.id) {
        try{
            const user = await User.findById(req.params.id);
            const isCurrentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers: req.body.userId}});
                await isCurrentUser.updateOne({$push:{following: req.params.id}});
                return res.status(200).json("Followed user successfully");
            } else {
                res.status(403).json("You are already following this user");
            }
        } catch(error) {
            res.status(500).json(error);
        };

    }else {
        return res.status(403).json("Action not allowed.");
    };
});

// Unfollow User
router.put("/:id/unfollow", async function (req, res) {
  // Validate user id
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const isCurrentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: {followers: req.body.userId}});
        await isCurrentUser.updateOne({$pull: {following: req.params.id}});
        return res.status(200).json("Unfollowed user successfully");
      } else {
        res.status(403).json("You're not following this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json("Action not allowed.");
  }
});





module.exports = router