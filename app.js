const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const _ = require("lodash");
const app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
    title:String,
    content:String
};
const Article=mongoose.model("Article",articleSchema);

app.route("/articles")

.get(function(req,res){  //using route handlers fromexpress js docs
    Article.find({},function(err,foundArticle){
        if(err){
            // console.log(err);
            res.send(err);
        }
        else{
            // console.log(foundArticle);
            res.send(foundArticle);
        }
    });
})
.post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article.");
        }
        else{
            res.send(err);
        }
    })
})
.delete(function(req,res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all the documents");
            }
            else{
                res.send(err);
            };
        });
    });

//requests targetting a particular article

app.route("/articles/:customTitleName")
.get(function(req,res){
    Article.findOne({title:req.params.customTitleName},function(err,foundArticleContent){
        if(foundArticleContent){
            res.send(foundArticleContent);
        }else{
            res.send("No articles found under that title , try again .");
        }
    });
})
.put(function(req,res){
    Article.findOneAndUpdate(
    {title:req.params.customTitleName},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
        if(!err){
            res.send("Successfully updated the article title and contents within.")
        }
    }
    );
})
.patch(function(req,res){
    Article.findOneAndUpdate(
    {title:req.params.customTitleName},
    {$set:req.body},
    function(err){
        if(!err){
            res.send("Successfully updated the specified field of the particular article .")
        }
    }
);
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.customTitleName},
        function(err){
            if(!err){
                res.send("Successfully deleted the specific article as requested.");
            }
            else{
                res.send(err);
            }
        }
    );
});

app.listen(3000,function(){
    console.log("Server has started successfully");
});