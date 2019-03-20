const express = require("express");
const path = require("path");
require("cross-fetch/polyfill");

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const host = "127.0.0.1";
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const API_KEY = "3b8367f0-b77e-11e8-bf0e-e9322ccde4db";
const API_NASA = "DEMO_KEY";

let comments = {};

// behavior for the index route
app.g

app.get("/", (req, res) => {
    const url = `https://api.harvardartmuseums.org/gallery?size=100&apikey=${API_KEY}`;
    const url2 = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`;
    /*fetch(url)
        .then(response => response.json())
        .then(data => {
            console.error("ok");
            res.render("index", { galleries: data.records });
        });*/
    fetch(url2)
        .then(response => response.json())
        .then(data => {
            res.render("index", { galleries2: data, test: "testing" });
            console.log(JSON.stringify(data) + "already did");

        });
});

app.get("/search",function(req,res){
    var search = {
        title : req.query.titles,
        description : req.query.description
    }
    console.log(search);
    const url = `https://images-api.nasa.gov/search?q=${search.title}&description=${search.description}`;
    //fetch('https://images-api.nasa.gov/search?q=rock&description=Tune%20into%20Third%20Rock%20Radio%20for%20The%20Joe%20Show%20starring%20Joe%20Acaba%20as%20Guest%20DJ%20on%20Thursday,%20December%207th%20at%205pm')
    fetch(url)
        .then(response => response.json())
        .then(data => {
           res.render("search",{userValue : search, test: "testing", nasa :data});
           console.log(JSON.stringify(data.collection.items[0].data[0].description) + "just did");
           data.collection.items.forEach(object => {
            console.log(JSON.stringify(object.data[0].title) + "loop");
           });
       });
    //res.json(student);
});

app.get("/gallery/:gallery_id", function(req, res) {
    const url = `https://api.harvardartmuseums.org/object?gallery=${
        req.params.gallery_id
    }&apikey=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            res.render("gallery", { objects: data.records });
        });
});

app.get("/object/:object_id", function(req, res) {
    const url = `https://api.harvardartmuseums.org/object/${
        req.params.object_id
    }?apikey=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            res.render("object", {
                object: {
                    data,
                    comments: comments[req.params.object_id]
                        ? comments[req.params.object_id]
                        : ["There are no comments!"]
                }
            });
        });
});

app.post("/object/:object_id", function(req, res) {
    let commentArr = comments[req.params.object_id];
    if (commentArr) {
        commentArr.push(req.body.comment);
    } else {
        comments[req.params.object_id] = [req.body.comment];
    }
    res.redirect(req.originalUrl);
});

app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
});