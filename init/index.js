// const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  
  }



main()
.then(()=>{
    console.log("Database is connected");
})
.catch(err => console.log(err));

const initDB = async()=>{
 await   Listing.deleteMany({});
 await Listing.insertMany(initData.data);
 console.log("data was initialized");

};
initDB();