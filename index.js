// This is A node js project for the given task by Risva Rachna
// The tasks are:


// A. API in NodeJS/Python
//     Create an API in NodeJS/Python that allows user login via username, password
//     a. username to be alphanumeric
//     b. username to be between 6-12 letters
//     c. password to allow alphabet, numbers, special characters
//     d. minimum password length is 6

// C. NodeJs/Python + MySQL assignment
//     Table "orders" has the following columns: orderId, title, description, createdAt
//     Write a function in NodeJs/Python that returns all orders created in the past 7 days



import express from 'express'
import mysql from 'mysql'

const app = express()
const router = express.Router()


//Connecting to mysql 
var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Encrypted@098',
    database:'employeedb'
});

mysqlConnection.connect((err) =>{
    if(!err){
        console.log("Connection to database successfull!!")
    }
    else{
        console.log(err.message)
    }
})

//Starting the server
app.listen(5000,() =>{
    console.log("Server starting at port 5000!")
})


function alphaNumeric(str){
    return(/^[a-zA-Z0-9]+$/.test(str))
}

//Creating the registration route



router.post('/register', (req,res)=>{
    console.log('Inside api...')
    try{
    inputData ={
        username: req.body.username,
        password: req.body.password
    }

    if(alphaNumeric(inputData.username)){
        if(inputData.username>=6 && inputData.username<=12 && inputData.password>=6){
            var sql='SELECT * FROM users WHERE username =?';
        mysqlConnection.query(sql, [inputData.username] ,function (err, data, fields) {
        if(err) throw err
        if(data.length>=1){
            var msg = inputData.username+ "was already exist";
        }else{
        // save users data into database
            var sql = 'INSERT INTO users SET ?';
            mysqlConnection.query(sql, inputData, function (err, data) {
            if (err) throw err;
                });
        var msg ="Your are successfully registered";
        }
        console.log('registration-form',msg);
        res.send('User Successfully registered!!')
        }) }else{
            res.send('username should be 6-12 characters long')
        }
    }else{
        res.send('No special character must be included in the username')
    }

    

}
catch(err){
    console.log(err)
}
})
 
//Create the login route

router.post('/login',async(req, res)=>{
    var username = req.body.username;

    var password = req.body.password;

    if(username && password)
    {
        query = `
        SELECT * FROM users
        WHERE username = "${username}"
        `;

        mysqlConnection.query(query, function(error, data){

            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    if(data[count].password === password)
                    {   
                        console.log(data[count].voted)
                        let datas = data[count].voted
                        res.send(JSON.stringify({"status": 200, "error": null, "response": datas}))                        // res.redirect("/");
                    }
                    else
                    {
                        res.send('Incorrect Password');
                    }
                }
            }
            else
            {
                res.send('Incorrect Email Address');
            }
        });
}})


//Creating route for fetching order past 7 Days

router.get('/orders', async(req,res)=>{
    mysqlConnection.query('select * from randomuser.order where createdAt >= NOW() + INTERVAL -7 DAY AND createdAt <  NOW() + INTERVAL  0 DAY ?', (err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows)
        }
        else{
            res.send(err);
        }
    })
})
