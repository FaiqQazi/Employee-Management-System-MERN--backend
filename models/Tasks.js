const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
      
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status:{
        type: String,
       
    },
    date:{
        type: Date,
        default: Date.now
    },
    report:{
        type : String,
       

    },
    assignedto:{
        type:String,
    

    },
    empid:{
        type:String,
        required:true
    }
  });
  const Task = mongoose.model('task', TaskSchema);
  module.exports = Task;
  