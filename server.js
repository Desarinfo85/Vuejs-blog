const express = require('express');
const mongoose = require('mongoose');

const app = express();

//mongodb connection

mongoose.connect('mongodb://localhost:27017/blog', {useUnifiedTopology: true,  useNewUrlParser: true });
mongoose.connection.on('connected', err =>{
    if (err) throw err;
    console.log('connected to database'); 
});

//midleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//modelSchema
const postSchema = mongoose.Schema({
    title: String,
    content: String,
    author: String,
    timestamp: String
});

const PostModel = mongoose.model("post", postSchema);

//API ROUTES

app.post('/api/post/new', (req,res)=>{
    let payload = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        timestamp: new Date().getTime()
    }

    let newPost = new PostModel(payload);
    newPost.save((err, result)=>{
        if (err) res.send({success: false, msg: err});
        res.send({success: true, msg: result});
    });
});

app.get('/api/posts/all', (req,res)=>{

    PostModel.find((err, result)=>{
        if(err) res.send({success: false, msg: error});
        res.send({success: true, result: result});
    });
})

app.post('/api/posts/update', (req,res)=>{
    let id = req.body._id;
    let payload = req.body;
    PostModel.findByIdAndUpdate(id, payload, (err, result)=>{
        if(err) res.send({success: false, msg: error});
        res.send({success: true, result: result});     
    });
});

app.post('/api/posts/remove',(req,res)=>{
    let id = req.body._id;

    PostModel.findById(id).remove((err, result)=>{
        if(err) res.send ({success: false, msg: error});
        res.send({success: true, result: result});
    })


});

//start server

app.listen(  process.env.PORT || 3000 , err=>{
    if(err) console.error(err);
    console.log('le serveur tourne sur le port %s', 3000 || process.env.PORT);   
});
