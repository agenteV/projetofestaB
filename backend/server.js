//modulos
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//routes
const authRouter = require('./routes/authRoutes');

//midllewares
//config
const dbName = "partytime";
const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//atrelando a primeira rota
app.use("/api/auth",authRouter);

//conexao mongodb
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
    useNewUrlParser:true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 20000
})

app.get("/", (req, res)=>{
    res.json({message : "Rota de teste, será trocada"});

})


//escutar ou entende a porta 3000

app.listen(port, ()=>{
    console.log(`O backend está rodando na porta ${port}`)
})