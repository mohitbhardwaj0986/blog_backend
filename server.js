import app from './app.js'

app.listen(process.env.PORT,()=>{
    console.log(`server is running port ${process.env.PORT}`)
})