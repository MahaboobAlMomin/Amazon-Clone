const express = require('express');
const mongoose = require("mongoose");
const router = new express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

router.get("/getproducts", async (req, res) => {
    try {
        const productsdata = await Products.find();
        /* console.log("console the data"+productsdata);*/
        res.status(201).json(productsdata);
    } catch (error) {
        console.log("error" + error.message);
    }
});
//get individual data
router.get("/getproductsone/:id", async (req, res) =>
{
    try
    {
        const { id } = req.params;
        /*  console.log(id);*/
        
        const individualdata = await Products.findOne({ id: id });
        /* console.log(individualdata +"individual data");*/
        res.status(201).json(individualdata);
        
    } catch (error)
    {
        res.status(400).json(individualdata);
        console.log("error" + error.message);
        
    }
});

// register the data
router.post("/register", async (req, res) =>
{
    // console.log(req.body);

    const {fname,email,mobile,password,cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword)
    {
       res.status(422).json({ error: "fill all details" });
        console.log("no data available");
    };

    try
    {
        const preuser = await USER.findOne({ email: email });

        if (preuser)
        {
           res.status(422).json({ error: "This email is already exist" });
        } else if (password !== cpassword)
        {
           res.status(422).json({ error: "password are not matching" });;
        } else
        {

            const finaluser = new USER({
                fname,email,mobile,password,cpassword
            });

            //bcryptjs(hasing)
            //password hasing process
            

            const storedata = await finaluser.save();
             console.log(storedata + "user successfully added");
           res.status(201).json(storedata);
        }

    } catch (error)
    {
       console.log("error" + error.message);
       return res.status(422).send(error);
    }
        
});

//login user api

router.post("/login", async (req, res) =>{
    const { email, password } = req.body;
    
    if (!email || !password)
    {
        res.status(400).json({ error: "fill all data" })
    };

        try{
            const userlogin = await USER.findOne({ email: email });
            console.log(userlogin + "user value");

            if (userlogin){
                const isMAtch = await bcrypt.compare(password, userlogin.password);
               console.log(isMAtch +"pass match");
                
                //token genrate
                const token = await userlogin.generateAuthtoken();
                //console.log(userlogin + " user value");


                //cookie generate
                res.cookie("Amazon", token,{
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                    
                })


                if (!isMAtch){
                    res.status(400).json({ error: "password not match" }) }
                else{
                    
                    res.status(201).json(userlogin);
                }
            } else
            {
                 res.status(400).json({ error: "invalid details" })
            }
        } catch (error)
        {
            
            res.status(400).json({ error: "invalid details" })
        }
})
    

//adding the data into cart

router.post("/addcart/:id", authenticate,async (req, res) =>
{
    try
    {
        const{id}  = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart value");
        
        const UserContact = await USER.findOne({ _id:req.userID });
        console.log(UserContact);

        if (UserContact)
        {
            const cartData = await UserContact.addcartdata(cart);
            await UserContact.save();
            console.log(cartData);
            res.status(201).json(UserContact);
        } else
        {
            res.status(401).json({ error: "invalid user" });
        }
    } catch (error)
    {
        res.status(401).json({ error: "invalid user" });
        }
        
    
})

//get cart details

router.get("/cartdetails", authenticate,async(req, res)=> {
    try {
        const buyuser = await USER.findOne({ _id:req.userID });
        res.status(201).json(buyuser);
    } catch (error) {
        console.log("error"+error)
    }
})



//get valid user

router.get("/validuser", authenticate,async(req, res)=> {
    try {
        const validuserone = await USER.findOne({ _id:req.userID });
        res.status(201).json(validuserone);
    } catch (error) {
        console.log("error"+error)
    }
})


//remove item from cart

router.delete("/remove/:id", authenticate, async (req, res) =>
{
    try
    {
        const { id } = req.params;
        req.rootUser.carts = req.rootUser.carts.filter((cruval) =>
        {
            return cruval.id != id;
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item remove");
        
    } catch (error) {
        console.log("error" + error);
        res.status(400).json(req.rootUser);
    }
})

//for user logout

router.get("/logout", authenticate, async(req, res) =>
{
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) =>
        {
            return curelem.token !== req.token
        });

        res.clearCookie("Amazon", { path: "/" });

        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");
    } catch (error)
    {
        console.log("error for user logout");
        
    }
})


module.exports = router;