const express = require("express");
const router = express.Router();
const Books = require("../models/book");
const jwt = require("jsonwebtoken");

router.use(express.json());

router.get('/booksList', async (req,res,next) => {
    try{
       const books = await Books.find({});
       res.status(200).json(books);
    } catch (err){
       res.status(err?.status || 500).json(err);
    }
})

router.get('/booksSearch/isbn/:isbn', async (req, res, next) => {
    try{
         const params = req.params;
        //  console.log(req);
         const books = await Books.find({isbn: params.isbn});
         console.log(books);
         res.status(200).json(books);
    } catch(err){
        res.status(err.status || 500).send(err)
    }
})

router.get('/booksSearch/author/:author', async (req, res, next) => {
    try{
         const params = req.params;
        //  console.log(req);
         const books = await Books.find({author: params.author});
         console.log(books);
         res.status(200).json(books);
    } catch(err){
        res.status(err.status || 500).send(err)
    }
})

router.get('/booksSearch/title/:title', async (req, res, next) => {
    try{
         const params = req.params;
        //  console.log(req);
         const books = await Books.find({title: params.title});
         console.log(books);
         res.status(200).json(books);
    } catch(err){
        res.status(err.status || 500).send(err)
    }
})

router.post("/addBooks" , (req, res, next) => {
        Books.insertMany(req.body.books).then((result) => {
            res.status(201).json({message: "Books inserted", data: result});
        }).catch(err => {
            res.status(err?.status || 500).json(err);
        });
})

router.post("/deleteBooks" , (req, res, next) => {
    Books.deleteMany()
    .then((result) => {
        res.status(201).json({message : "collections deleted", result});
    }).catch((err) => {
        res.status(500).json({ message: "An error occurred", error: err });
    })
})

router.post("/buy", async (req, res, next) => {
     try{
         const incomingToken = req.headers['authorization'];
         jwt.verify(incomingToken.split(" ")[1], process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                res.status(err.status || 500).send(err);
            } else{
                res.status(200).json({...decoded, message: "Token is correct"});
            }
         } );
     } catch(error){
         res.status(error.status || 500).json(error);
     }
})

module.exports = router;