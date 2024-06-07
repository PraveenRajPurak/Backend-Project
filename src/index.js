import dotenv from "dotenv";

dotenv.config({path : "./.env"});
import {app} from "./app.js";
import connectDB  from "./db/db_connect.js";

connectDB()
.then(
    () =>{
        app.listen( process.env.PORT, 
            () => console.log(`Server is running on port ${process.env.PORT}`) );
    }
)
.catch((error) => console.log("MongoDB connection Error: ", error));
;
