//jshint esversion:6
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();
// mongoose.connect("",{useNewUrlParser:true})

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true})
const articleSchema={
    title:String,
    content:String
};
const Article=mongoose.model("Article",articleSchema);

app.route("/articles")
.get(function(req,res){
    Article.find(function(err,foundArticles){
        // console.log(foundArticles);
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    })
})
.post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle=new Article({
        title: req.body.title,
        content:req.body.content
    });

    newArticle.save(function(err){
        if(err){
            // console.log(err);
            res.send(err);
        }else{
            res.send("Successfully added a new article.");
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles");
        }else{
            res.send(err);
        }

    })
})

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,result){
        if(!result){
            res.send("No matching articles found with that title");
        }else{
            res.send(result);
        }
    })
})
.put(function(req,res){//put changes complete record
    Article.updateOne(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        // {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully Updated");
            }
            else{
                res.send("Error Occured while updating");
            }
        }
    )
})
.patch(function(req,res){
    Article.updateOne({
        title:req.params.articleTitle
    },
    {$set : req.body},// sets the values given in form body that matches
    function(err){
        if(!err){
            res.send("Successfully Updated record")
        }else{
            res.send("Some Error Occured");
        }
    })
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err){
        if(!err)
        {
            res.send("Successfully deleted article");
        }else{
            res.send("Some Error Occured");
        }

    })
})



// app.get("/articles",function(req,res){
//     Article.find(function(err,foundArticles){
//         // console.log(foundArticles);
//         if(!err)
//         {
//             res.send(foundArticles);
//         }else{
//             res.send(err);
//         }

//     })
// })

// app.post("/articles",function(req,res){
//     // console.log(req.body.title);
//     // console.log(req.body.content);
//     const newArticle=new Article({
//         title: req.body.title,
//         content:req.body.content
//     });

//     newArticle.save(function(err){
//         if(err){
//             // console.log(err);
//             res.send(err);
//         }else{
//             res.send("Successfully added a new article.");
//         }
//     });
// })

// app.delete("/articles",function(req,res){

//     Article.deleteMany(function(err){
//         if(!err){
//             res.send("Successfully deleted all articles");
//         }else{
//             res.send(err);
//         }

//     })
// })


app.listen(process.env.PORT ||3000,function(){
    console.log("Server is successfully working")
})

