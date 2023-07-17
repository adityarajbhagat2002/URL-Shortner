const User = require("../models/user");

async  function handleUserSignup(req,res){
    const {name , email , password}  = req.body;
    await User.create({
        name,
        email,
        password
    });
    res.redirect('/')
}

async function handleUserLogin(req,res){
    const {email , password} = req.body
    const user  = await User.findOne({email , password})
    if(!user) return res.render('login',{
        error : "Invalid username or Password"
    });

    return res.redirect('/')
    
    

}

module.exports = {
    handleUserSignup,
    handleUserLogin,
}