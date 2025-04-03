const express = require("express");
const app=express();
const Listing = require("./models/listing");




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
app.post("/listings",async(req,res,next)=>{
    // let {title,description,image,price,location,country}=req.body;
    // let listing=req.body.listing;
   try{
    const newlisting=new Listing(req.body.listing)
    await newlisting.save();
    
    console.log(newlisting);
    res.redirect("/listings");
   }
   catch(err){
    next(err);
   }
    // let newList = new Listing({
    //     title:title,
    //     description:description,
    //     image:image,

    // })
})
//show rout -> shwo data of all in details

app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const iddata= await Listing.findById(id);
    console.log(iddata);
    res.render("listing/show.ejs",{iddata});
})


//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;

    const allListing=await  Listing.findById(id);
    res.render("listing/edit.ejs",{allListing});
});

//update Route
app.put("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    const lists=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
})

//delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    let deleteList = await Listing.findByIdAndDelete(id);
    console.log(deleteList);
   res.redirect("/listings");
})



//middleware
app.use((err,res,req,next)=>{
    res.send("something wents wrong");
});