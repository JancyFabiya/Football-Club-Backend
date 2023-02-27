const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.set("strictQuery", false);

  mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(()=>{
        console.log("DB Connected Successfully");
    }).catch((e)=>{
        console.log('DB not Connected');
    });
};

module.exports = connectDatabase;
