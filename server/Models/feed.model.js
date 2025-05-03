const mongoose = require('mongoose')


const feedSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number, 
    required: true
  },
  email: {
    type:String,
    required: true
  },
  
  
  vehicalid: {
    type:String, 
    required: true
  },
  rating: {
    type:String, 
    required: true
  },
  descrip: {
    type:String, 
    required: true
  },
  
  
}, { timestamps: true });


const Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed