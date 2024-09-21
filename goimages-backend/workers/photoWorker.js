import { Worker } from "bullmq";

const worker = new Worker("photoQueue", async job => {
    console.log(job.data.originalname)
    await new Promise(r => setTimeout(r(), 5000));
}, { connection: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST } });

worker.on("ready", () => console.log("photoQueueWorker is ready"))

worker.on("completed", job => {
    // console.log(job.id)
})

worker.on("failed", (job, err) => {
    console.log(err)
    console.log(job.id)
})