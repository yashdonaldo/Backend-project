const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/flyingtradeuser').then(()=>{
    console.log("Connection Sucessfully")
}).catch((error)=>{
    console.log(error, "Server is not running")
})

// module.exports = mongoose;
