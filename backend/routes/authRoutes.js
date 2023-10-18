//ROTAS
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const { error } = require("console");

//REGISTRAR O USUÁRIO
router.post("/register",async(req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword
    
    //testendo todos os campos
    if (name==null || email ==null || password == null || confirmpassword == null){
        return res.status(400).json({error : "Por favor preencha todos os campos"})
    }

    //testando senha
    if(password != confirmpassword){
            return res.status(400).json({error : "As senhas não conferem!"})
    }

    //se já existe o usuario
    const emailExist = await User.findOne({email : email});
    if(emailExist){
        return res.status(400).json({error : "O email informado já existe!"})
    }

    //criando hash de senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt)

    //criando usuario
    const user = new User({
        name : name,
        email : email,
        password : passwordHash
    });

try{
    const newUser = await user.save();
    //criando o token
    const token = jwt.sign({
        name : newUser.name,
        id : newUser._id
    },"segredo")
    
    //retornando token
    res.json({error : null,msg :"Você fez o cadastro com sucesso!",token : token, userId : newUser._id})
} 
    
    catch(error){
    res.status(400).json({error});
    }
   
    

});

//criando rotas de login
router.post("/login", async(req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    //usuário existe
    const user = await User.findOne({email : email});

    if(!user){
    return res.status(400).json({error : "E-mail não cadastrado, usuário não existe!!!"})
    }

    //comparando senha
    const checkpassword = await bcrypt.compare(password,user.password);
    if(!checkpassword){
        return res.status(400).json({error : "Senha incorreta!"})
    }
    //usuário cadastrado gerando token
    const token = jwt.sign({
        name : user.name,
        id : user._id
    },"segredo");
    res.json({error : null, msg : "Você esta logado!!!", token: token, userId: user._id})

    });
    
module.exports = router;