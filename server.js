require("dotenv").config();
const app = require("./src/app");
const port = process.env.PORT || 3380;
const connectDb = require('./src/DB/connection');

connectDb();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})