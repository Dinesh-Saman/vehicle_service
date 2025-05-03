const mongoose = require('mongoose')


const massSchema = new mongoose.Schema({
  
  descrip: {
    type:String, 
    required: true
  },
  
  
}, { timestamps: true });


const Mass = mongoose.model('Mass', massSchema);

module.exports = Mass