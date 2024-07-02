const mongoose=require('mongoose')

mongoose.connect("mongodb://0.0.0.0:27017/tutorial")
.then(()=>{
    console.log('mongodb connected');
})
.catch(()=>{
    console.log("error");
})

const tutschema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model('student',tutschema)

data={
    name:"vedini"
}

collection.insertMany([data])