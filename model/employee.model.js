const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var empSchema = new Schema({

    firstname : {
        type : String,
        uppercase : true,   //it will always covert firstName to Uppercase
        required : true
    },
    middlename : {
        type : String,
        uppercase : true,
        required : false  
    },
    lastname : {
        type : String,
        uppercase : true,
        required : true    //if 'true' then this field must have some value
    },
    email : {
        type : String,
        required : true
    },
    passwordhash : {
        type : String,
        required : true
    },
    empid : {
        type : String,
        required : true
    },
    mobileno : {
        type : Number,
        max : 9999999999,   //setting max value for Mobile
        unique : true      //ensures this will have always unique value  
    },
    dateofbirth : {
        type : Date,
        required : true
    }
},
{
    versionKey: false,
},
{
    timestamps: false,
},);

var emp = mongoose.model('employee',empSchema);
module.exports = emp;