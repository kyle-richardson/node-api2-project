const express = require('express');
const db = require('../data/db')

const router = express.Router();
router.use(express.json()) 

router.get('/', (req, res) => {
    db.find()
        .then(promise=> {
            res.status(200).json({ message: 'success', post_list: promise})
        })
        .catch(err=> {
            res.status(500).json({ message: 'failure', error: 'Server failed to retrieve posts'})
        })
});

router.get('/:id', (req, res) => {
    const {id} = req.params
    db.findById(id)
        .then(post => {
            if(!!post) res.status(200).json({ message: 'success', post: post})
            else res.status(400).json({ message: 'failure', error: `Could not find post with ID ${id}`})
        })
        .catch(err=> {
            res.status(500).json({ message: 'failure', error: 'Server failed to retrieve post'})
        })
});

router.get('/:id/comments', (req, res) => {
    const {id} = req.params
    db.findById(id)
        .then(post=> {
            if(!!post) {
                db.findPostComments(id)
                    .then(promise=> {
                        res.status(200).json({ message: 'success', comment_list: promise})
                    })
                    .catch(err=> {
                        res.status(500).json({message: 'failure', error: 'Server failed to retrieve comments'})
                    })
            }
            else res.status(400).json({ message: 'failure', error: `Could not find post with ID ${id}`})
        })

});

router.post('/', (req, res) => {
    const newPost = req.body
    if(!newPost.title || !newPost.contents) {
        res.status(400).json( { message: 'failure', error: 'Title and contents fields required'})
    }
    else
        db.insert(newPost)
            .then(promise => {
                db.findById(promise.id) 
                    .then(post => {
                        res.status(200).json({ message: 'success', post: post})
                    })
                    .catch(err=> {
                        res.status(500).json({ message: 'failure', error: 'Server failed to retrieve post'})
                    })
            })
            .catch(err=> {
                res.status(500).json({ message: 'failure', error: 'Server failed to insert new post'})
            })
});

router.post('/:id/comments', (req, res) => {
    const {id} = req.params
    const comment = req.body
    if(!comment.text || !comment['post_id']) {
        res.status(400).json({ message: 'failure', error: 'text and post_id fields required'})
    }
    else if(comment['post_id']!=id) {
        res.status(401).json({ message: 'failure', error: 'post_id field must match params id in url'})
    }
    else
        db.findById(id)
            .then(post=> {
                if(!!post) {
                    db.insertComment(comment)
                        .then(promise=>{
                            res.status(200).json({ message: 'success. comment added'})
                        })
                        .catch(err => {
                            res.status(500).json({ message: 'Server failed to add comment'})
                        })
                }
                else res.status(400).json({ message: 'failure', error: `Could not find post with ID ${id}`})
            })

});

router.delete('/:id', (req, res) => {
    const {id} = req.params
    db.findById(id)
        .then(post=> {
            if(!!post) {
                db.remove(id)
                    .then(promise => {
                        res.status(200).json({ message: `success. ${promise} post(s) deleted`})
                    })
                    .catch(err=> {
                        res.status(500).json({ message: 'failure', error: 'Server failed to remove post'})
                    })
            }
            else res.status(400).json({ message: 'failure', error: `Could not find post with ID ${id}`})
        })
});

router.put('/:id', (req, res) => {
    const {id} = req.params
    const changes = req.body
    if(!changes.title || !changes.contents) {
        res.status(400).json( { message: 'failure', error: 'Title and contents fields required'})
    }
    else
        db.findById(id)
            .then(post=> {
                if(!!post) {
                    db.update(id, changes)
                        .then(promise => {
                            if (promise >0) {
                                db.findById(id)
                                    .then(post => {
                                        res.status(200).json({ message: 'success', post: post})
                                    })
                                    .catch(err=> {
                                        res.status(500).json({ message: 'success', error: 'Server failed to retrieve post after changes'})
                                    })
                            }
                            else {
                                res.status(400).json({message: 'failure', error: 'No changes found.'})
                            }
                        })
                        .catch(err=> {
                            res.status(500).json({message: 'failure', error: 'Server could not update record'})
                        })
                }
                else res.status(400).json({ message: 'failure', error: `Could not find post with ID ${id}`})
            })
});

module.exports = router; 