const cors = require('cors');

const  corsOrigin =
    cors({
      origin: async (origin, callback)=> {
        if (!origin) return callback(null, true);

        const allowedOrigins = process.env.ORIGIN_ALLOW;
        
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    });
 
module.exports = corsOrigin;
