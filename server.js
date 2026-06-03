require("dotenv").config();
const app = require("./src/app");
const port = process.env.PORT || 3380;  
const connectDb = require('./src/Setting/DBconnection');
const connectRedis = require('./src/Setting/redis');

const init = async()=>{
await connectDb();
await connectRedis();
}
init()

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})