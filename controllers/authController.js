const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async(req, res) =>{
    try{
        const{username, email, password} = req.body;

        const[existingUser] = await db.query("select * from users where email =?",[email]); // check if email is already in db
        if(existingUser.length > 0){
            res.status(400).json({error:'Email already in use!'});
        }
        const salt = await bcrypt.genSalt(10); // creates a random salt with 10 rounds of processing
        const hashedPassword = await bcrypt.hash(password,salt); // using the above salt to generate the encrypted pwd
        const [result] = await db.query(
            'INSERT into users (email,username,password) values(?,?,?)',[email,username,hashedPassword]
        );
        res.status(201).json({message:"User Registered Successfuly!", userId: result.insertId});

    }
    catch(error){
        console.error(error);
        res.status(500).json({error:'Server error during signup'})
    }
};

exports.login = async(req,res) =>{
    try{
        const {email,password} = req.body;

        const [users] = await db.query("select * from users where email = ?",[email]);
        if(users.length === 0){
            return res.status(401).json({error:'Invalid user'});
        }
        const user = users[0];
        const foundMatch = await bcrypt.compare(password,user.password); // match with the hash that is stored in the db
        if(!foundMatch){
            res.status(401).json({error:"Password/Username combination doesn't match"});
        }

        const token = jwt.sign({
            id:user.id,
            username: user.username
        },process.env.JWT_SECRET,{expiresIn:'1d'});
        res.json({message:"Logged in Sucessfully!",
            token,
            user:{id:user.id, username:user.username, email:user.email}
        });
    }

    catch(error){
        console.error(error);
        res.status(500).json({error:"INternal Server Error"});
    }
}

exports.logout = (req,res) =>{

}