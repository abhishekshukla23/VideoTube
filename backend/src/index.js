import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);




import dotenv from "dotenv";
import ConnectDB from "./db/db.js"


dotenv.config(
    {
        path: "./.env",

    }
)

const { default: app } = await import("./app.js");



ConnectDB().then(() => {
    app.on("error", (err) => {
        console.log("ERR:", err)
    })
    app.listen(process.env.PORT || 5000, () => {
        console.log(`server is running at port ${process.env.PORT}||5000`)
    })

    app.get('/', (req, res) => {
        res.send(`server runnning at port ${process.env.PORT}`)
    })
})


    .catch((error) => {
        console.log("MongoDb connection failed!!", error)
    })

