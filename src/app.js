require('dotenv').config()
const express = require('express')
const path = require('path')
const hbs = require('hbs')

const cookieParser = require('cookie-parser')
const auth = require('./middleware/auth')

const bcrypt = require('bcrypt')
const register = require('../models/regesterd')
const app = express()
require('../db/conn')
const port = process.env.PORT || 3000;

const staticpath = path.join(__dirname, "../public")
const stviews = path.join(__dirname, "../templates/views")
const stparials = path.join(__dirname, "../templates/partials")

app.use(express.json())
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }))

app.use(express.static(staticpath))
app.set('views', stviews)
app.set("view engine", 'hbs')
hbs.registerPartials(stparials)

console.log(process.env.SECRET_KEY)

app.get("/", (req, res) => {
    res.render('index')
})
app.get("/register", (req, res) => {
    res.render('login')
})
app.get("/login", (req, res) => {
    res.render('sigin')
})
app.get("/about" , auth ,(req, res) => {
    // console.log(`The yash cookie is ${req.cookies.yash}`)
    res.render('about')
})
app.get("/logout", auth, async(req, res) => {
    try {
        // fro single logout 
        // req.user.token = req.user.token.filter((currentelement) =>{
        //     return currentelement.token != req.token
        // })
        // logou from all devices  
        req.user.token = []


        // console.log(res.user)
        
        res.clearCookie("yash")
        console.log("Log Out Sucessfully")
        await req.user.save()
        res.render("sigin")
    } catch (error) {
        res.status(401).send(error)
        
    }
})

// create a user in our database

app.post("/register", async (req, res) => {
    try {
        const password = req.body.crtpassword;
        const cpassword = req.body.cnfpassword;
        if (password === cpassword) {
            const registeremploye = new register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                crtpassword: password,
                cnfpassword: cpassword,
            })

            // middleware
            const token = await registeremploye.generateAuthToken()

            res.cookie("yash", token, {
                expires: new Date(Date.now() + 5000),
                httpOnly: true
            });
            
            console.log(cookie)

            const rt = await registeremploye.save()
            res.status(201).render('index')
        } else {
            res.send("Password not matching")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

// login check  
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await register.findOne({email});

        const isMatch = await bcrypt.compare(password, useremail.cnfpassword)

        const token = await useremail.generateAuthToken();
        console.log("the token part " + token)

        res.cookie("yash", token, {
            expires: new Date(Date.now() + 50000),
            httpOnly: true
        });
        // console.log(`The yash cookie is ${req.cookies.yash}`)
        if(isMatch){
            res.status(201).render('index')
    
        }else{
            res.send('invalid login detail')
        }
        // res.send(useremail.cnfpassword);
        // console.log(useremail);

        // console.log(`email is ${email} and password is ${password}`)
    } catch (error) {
        res.status(400).send("Invalid email or password")
    }

})


// const jwt = require('jsonwebtoken')
// const createToken = async()=>{
//     let token = jwt.sign({_id:'1289370128'}, "yashdonaldoisgood",{
//         expiresIn: "2 minutes"
//     })
//     console.log(token)
//     const userver = jwt.verify(token, "yashdonaldoisgood");
//     console.log(userver)
// }
// createToken()


app.listen(port, (req, res) => {
    console.log(`Our server is started at http://localhost:${port}`)
})



// bcrypt code 

// const bcrypt = require('bcrypt')

// const securePassword = async (pass) => {
//     const passhash = await bcrypt.hash(pass, 10);
//     console.log(passhash)

//     const passmatch = await bcrypt.compare(pass, passhash);
//     console.log(passmatch)
// }

// securePassword("thapa@123")





