const mongoose = require("mongoose");
const { Schema } = mongoose;
const{Review} = require("./review.js");
const {User} = require("./users.js");


const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String
        
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:{
        type:[{ type: Schema.Types.ObjectId, ref:"Review" }]// ref is name of the model
    },
    owner:{
         type: Schema.Types.ObjectId,
          ref: 'User' 

    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    
})
const listing = mongoose.model("Listing", listingSchema);
listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(Listing){
        await Review.deleteMany({_id:{$in:Listing.reviews}});

    }
   
})
module.exports = listing; 
