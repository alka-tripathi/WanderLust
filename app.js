const express = require("express");
const app=express();
const Listing = require("./models/listing");
const   Review =require("./models/review.js");


const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js");

const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

const methodOvveride = require("method-override");
app.use(methodOvveride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

const mongoose = require("mongoose");
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  }



main()
.then(()=>{
    console.log("Database is connected");
})
.catch(err => console.log(err));



app.get("/",(req,res)=>{
    res.send("Hi i am root");
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});

// app.get("/testListing", async(req,res)=>{
// let sampleListing = new Listing({
//     title:"My new Villa",
//     description:"By the beach",
//     price:1200,
//     location:"Calangutes",
//     country:"India",
// });
// await sampleListing.save()
// .then((res)=>{
//     console.log("save");
// })
// .catch((err)=>{
//     console.log(err);
// })
// });

//GET route
app.get("/listings",async(req,res)=>{
 const allListing=await  Listing.find({});
 res.render("listing/index.ejs",{allListing});
  
})

//Create: New And Create Route
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
})

//POST request
app.post("/listings",wrapAsync(async(req,res,next)=>{
    // let {title,description,image,price,location,country}=req.body;
    // let listing=req.body.listing;

  if(!req.body.listing){
    throw new ExpressError(404,"No listing is provided");
  }
  const newlisting=new Listing(req.body.listing)
  await newlisting.save();
  
  console.log(newlisting);
  res.redirect("/listings");
   

    // let newList = new Listing({
    //     title:title,
    //     description:description,
    //     image:image,

    // })
}));
//show rout -> shwo data of all in details

app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const iddata= await Listing.findById(id);
    console.log(iddata);
    res.render("listing/show.ejs",{iddata});
}));


//Edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;

    const allListing=await  Listing.findById(id);
    res.render("listing/edit.ejs",{allListing});
}));

//update Route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const lists=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

//delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deleteList = await Listing.findByIdAndDelete(id);
    console.log(deleteList);
   res.redirect("/listings");
}));


//review path
app.get("/listings/:id/reviews", async(req,res)=>{
   let listing = await Listing.findById()


})

//standard response  -> if route is send to another path
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})







//middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    console.error("Error:", err); // Log the error for debugging
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});
