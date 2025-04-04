const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
      type:  String,
    
      default:"https://unsplash.com/photos/3d-render-of-luxury-hotel-lobby-and-reception-FNAURWZ6Mqc",
      set:(v)=> v ===""?"https://unsplash.com/photos/3d-render-of-luxury-hotel-lobby-and-reception-FNAURWZ6Mqc":v   //v image value
    },
    price:Number,
    location:String,
    country:String,
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;