import { createClient } from "redis";
import dotenv from "dotenv";


export const redis = createClient({url:process.env.REDIS_URL});

redis.on(
"error",

(err)=>{

console.log(
"Redis Error:",
err
);

}
);

export async function
connectRedis(){

if(
!redis.isOpen
){

await redis.connect();

console.log(
"Redis Connected"
);

}

}