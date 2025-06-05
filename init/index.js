const mongoose = require("mongoose");
const { Schema } = mongoose;
const Listing = require("../models/listing.js");
const initdata = require("./data.js");
console.log(initdata);
const User = require("../models/users.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
     return await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("sucessfullly connected to  database");
}).catch((e)=>{
    console.log("err",e);
})

const insert_database = async () => {
    let user = await User.findOne({ username: "rajesh_rao_rs" });
  
    if (!user) {
      console.log("User not found");
      return;
    }
  
    let userId = user._id;
  
    // Set owner field in each object
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: userId,
    }));
  
    // Optional: console log a sample to verify
    console.log("Sample listing with owner:", initdata.data[5]);
  
    // Insert listings
    await Listing.insertMany(initdata.data);
    console.log("Data is stored in MongoDB");
  };
  
  insert_database();