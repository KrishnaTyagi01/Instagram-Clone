const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const requireLogin = require('../middleware/requireLogin')

//===========CREATE ALL POSTS ROUTE ============
router.get('/allpost',requireLogin ,(req,res)=>{
    Post.find()
    .populate('postedBy', '_id name') //HERE WE ARE POPULATING ONLY ID AND NAME. NO PASSWORD AND EMAIL
    .populate('comments.postedBy', '_id name') 
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
        
    })
})

//===========CREATE POST ROUTE ============
router.post('/createpost', requireLogin, (req, res)=>{
    const {title, body, pic} = req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error: "Please add all the fields"});
    }
    req.user.password = undefined; //SO THAT WE DON'T SHOW PASSWORD IN OUR POSTS IN MONGODB
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err);
    })
})

//===========CREATE MY POST ROUTE ============
router.get('/mypost', requireLogin,(req, res)=>{
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost =>{
        res.json({mypost});
    })
    .catch(err=>{
        console.log(err);
    }) 
})


//===========CREATE LIKE ROUTE ============
router.put('/like', requireLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes: req.user._id}
    },{
        new: true
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result)
        }
    })
})

//===========CREATE UNLIKE ROUTE ============
router.put('/unlike', requireLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes: req.user._id}
    },{
        new: true
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result)
        }
    })
})

//===========CREATE COMMENT ROUTE ============
router.put('/comment', requireLogin, (req, res)=>{
    const comment = {
        text:req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments:comment}
    },{
        new: true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy", "_id name")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result)
        }
    })
})

//===========CREATE DELETE POST ROUTE ============

router.delete("/deletepost/:postId", requireLogin,(req, res)=>{
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id") 
    .exec((err, post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result =>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

//===========CREATE SUSCRIBE POST ROUTE ============
router.get('/getsubpost',requireLogin ,(req,res)=>{
    Post.find({postedBy : {$in : req.user.following}}) //CHECKING FOR IF postedBy IS PRESENT IN FOLLOWING LIST
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name') 
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.put('/updatepost', requireLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.user._id,{ $set:{body:req.body.body, title:req.body.title}}, {new:true}, (err, result)=>{
        if(err){
            return res.status(422).json({error:"cannot update post"})
        }
        res.json(result);
    })
})
module.exports = router;