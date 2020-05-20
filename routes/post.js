const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');


// http://localhost:5000/api/post (GET)
router.get('/', async (req, res) => {
    const posts = await Post.find({});
    res.status(200).json(posts);
});

// http://localhost:5000/api/post (POST)
router.post('/', async (req, res) => {
    const postData = {
        hour: req.body.hour,
        date: req.body.date,
        name: req.body.name,
        bandName: req.body.bandName,
        phoneNumber: req.body.phoneNumber,
        bass: req.body.bass,
        keys: req.body.keys,
        cymbals: req.body.cymbals,
        microphones: req.body.microphones
    }
    const post = new Post(postData);
    await post.save();
    res.status(201).json(post);
});

// http://localhost:5000/api/post/23 (DELETE)
router.delete('/:postId', async (req, res) => {
    await Post.remove({_id: req.params.postId});
    res.status(200).json({
        message: 'Удалено'
    });
});

module.exports = router;