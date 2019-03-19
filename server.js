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

let comments = {};

// behavior for the index route
app.get("/", (req, res) => {
    const url = `https://api.harvardartmuseums.org/gallery?size=100&apikey=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            res.render("index", { galleries: data.records });
        });
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