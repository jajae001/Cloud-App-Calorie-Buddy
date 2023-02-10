module.exports = function(app)
{//----------------------------START---------------------------------------------------------------------
 
// This needs to stay top of page
  const redirectLogin = (req, res, next) => {

   if (!req.session.userId ) {
     res.redirect('./login')
   } else { next (); }
   }

const { check, validationResult } = require('express-validator');
////////////////////////////////////////////
//API

//------------------
app.get('/api', function (req,res) {
     var MongoClient = require('mongodb').MongoClient;
     var url = 'mongodb://localhost';
     MongoClient.connect(url, function (err, client) {
     if (err) throw err                                                                                                                                                
     var db = client.db('caloriebuddydb');                                                                                                                                                                   
      db.collection('food').find().toArray((findErr, results) => {                                                                                                                                
      if (findErr) throw findErr;
      else
         res.json(results);                                                                                                                                             
      client.close();                                                                                                                                                   
  });
});
});

   
//------------------  
//update and delete page

 app.get('/updatedelete',redirectLogin, function (req,res) {
         res.render('updatedelete.html');

      });

//food update page
     app.post('/fupdated', function (req,res) {
             // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
       //connecting mongodb

      MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('caloriebuddydb');  //finding if name and username are true      
        db.collection('food').findOneAndUpdate({"name":req.body.name , "username":req.session.userId},
            {$set:{

        "typical_values_per": req.body.typical_values_per,          //updating the new values
        "unit_of_the_typical_value": req.body.unit_of_the_typical_value,
        "calories": req.body.calories,
        "carbs": req.body.carbs,
        "fat": req.body.fat,
        "protein": req.body.protein,
        "salt": req.body.salt,
        "sugar": req.body.sugar
            },function(err,result) {
                
                if(err){throw err}
				
            }


        });
        client.close();
        
	res.send('<h1 style="font-family:arial; font-size:100px;text-align:center;"> Your Results</h1><p style="font-family:courier;font-size:50px;color:lightblue;text-align:center;">Please know that only the creator of the posted food item  is allowed to delete this item..' + '<br>'+ 'If you are not the creator,you will not be able to update or delete this.'+' <br>' + ' </p><p style="font-family:courier;font-size:50px; color:indianred;text-align:center;">Please be sure to choose from your current published items to update<br>'+'<br />'+'<a href='+'./'+'>Home</a></p>' )      
        });
       });


//food delete page
     app.post('/fdeleted', function (req,res) {
             // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
       //connecting mongodb

      MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('caloriebuddydb');
        db.collection('food').deleteOne( {"name":req.body.name, "username": req.session.userId },function (err, result) {
	if(err){throw err}
	
          } )
     
        client.close();
         res.send('<h1 style="font-family:arial; font-size:100px;text-align:center;"> Your Results</h1><p style="font-family:courier;font-size:50px;color:lightblue;text-align:center;">Please know that only the creator of the posted food item is allowed to delete this item..' + '<br>'+ 'If you are not the creator,you will not be able to update or delete this '+' <br>' + ' </p><p style="font-family:courier;font-size:50px; color:indianred;text-align:center;">Please be sure to choose from your current published items to update<br>'+'<br />'+'<a href='+'./'+'>Home</a></p>' )
        });
 });   


//logoutpage
app.get('/logout', redirectLogin, (req,res) => {
     req.session.destroy(err => {
     if (err) {
       return res.redirect('./')
     }

     res.send('<h1 style="font-family:arial; font-size:100px;text-align:center;">You Are Now Logged Out.<br></h1> <p style="font-family:courier;font-size:50px; color:indianred;text-align:center;"> Have A Nice Day And Come Back Soon<br> <a href='+'./'+'>Home</a></p>');
     })
   })
 

//delete user page
  app.get('/deleteuser',redirectLogin, function (req,res) {
         res.render('deleteuser.html');

      });


// deleteduser page

  
  app.post('/deleteduser', function (req, res) {
    
      // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';


//connecting to mongo db
       MongoClient.connect(url, function(err, client){

        if (err) throw err;
        var db = client.db ('caloriebuddydb');
           //searching username in user
        db.collection("users").findOne({"username": req.body.username},function(err, users)  {
            if (err) {throw err;}
            if(users==null){  //if the user name is not in database
                res.send('<h1 style="font-family:arial; font-size:80px;text-align:center;">Sorry!.. User Not Found'+ '<br />'+'<a href='+'./'+'>Home</a></h1>');
            }
	    	
            else{// deleting a element by matching username
                  db.collection('users').deleteOne( {" username": req.body.username },function () {
      res.send('<h1 style="font-family:arial; font-size:80px;text-align:center;">Success!! User--> ' +req.body.username +' Deleted From Our Records <br> <br>'+ '<br />'+'<a href='+'./'+'>Home</a></h1>' );
    } )
            }
            
              });

            });

      });


// login page
  app.get('/login', function (req,res) {
         res.render('login.html');

      }); 
   


//logged in page
  app.post('/loggedin', function (req,res) {
    //bycrypt const
      const bcrypt = require('bcrypt');
      const plainPassword = req.body.password;
      // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';

     
//connecting to mongo db
       MongoClient.connect(url, function(err, client){

        if (err) throw err;
        var db = client.db ('caloriebuddydb');
           //searching username in user
        db.collection("users").findOne({username: req.body.username},function(err, users)  {
            if (err) {throw err;}
            if(users==null){  //if the user name is not in database 
                res.send('<h1 style="font-family:arial; font-size:80px;text-align:center;"> The user You Entered Is Not Found <br> <br>'+ '<br />'+'<a href='+'./'+'>Home</a></h1>');
            }
            // Load hashed password from your password database. (hint: use find() similar to search-result page)
           
	  bcrypt.compare(plainPassword, users.password, function(err, result) {
          // comparing hashedpassword to plain password
         
	  if (result == true){

		// **** save user session here, when login is successful

		req.session.userId = req.body.username;
		
                res.send('<h1 style="font-family:arial; font-size:80px;text-align:center;"> Success!! You Are Now Logged In <br> <br>'+ '<br />'+'<a href='+'./'+'>Home</a></h1>');
            }
            else{ 
                res.send('<h1 style="font-family:arial; font-size:80px;text-align:center;"> Sorry But Your Password Has failed</h1><br><p style="font-family:courier;font-size:50px; color:indianred;text-align:center;"> Please Try Again Or Register <br> <br> '+ '<br />'+'<a href='+'./'+'>Home</a></p>');
            }
            });
              
		
              });
            
            });     
        
      });  



/*//list user
	app.get('/listusers',redirectLogin, function(req, res) {
      var MongoClient = require('mongodb').MongoClient;
      var url = 'mongodb://localhost';
//connecting to mongo db
      MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('caloriebuddydb');
// findin elements inside users
      db.collection('users').find().toArray((findErr, results) => {
      if (findErr) throw findErr;
      else
         res.render('listusers.ejs', {users:results});
      client.close();
       });
     });
    })   */

//homepage
     app.get('/',function(req,res){
        res.render('index.html')
     }); 
// food list page
     app.get('/foodlist', function(req, res) {
      var MongoClient = require('mongodb').MongoClient;
      var url = 'mongodb://localhost';
//connecting to mongodb
      MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('caloriebuddydb');
//find elements in books to array
      db.collection('food').find().toArray((findErr, results) => {
      if (findErr) throw findErr;
      else
         res.render('foodlist.ejs', {food:results});
      client.close();
       });
     });
    });

     //addFood page
     app.get('/addfood',redirectLogin, function(req,res){
         res.render('addfood.html');
    });
// food added page
     app.post('/foodadded', function (req,res) {
       // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
       //connecting mongodb

      MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('caloriebuddydb');
        db.collection('users').findOne({username: req.session.userId}, (err, results)=> {
            var user = req.session.userId;
        
        db.collection('food').insertOne({    //adding the form data into the database including current user 
        username:user,
        name: req.body.name,
        typical_values_per: req.body.typical_values_per,
        unit_of_the_typical_value: req.body.unit_of_the_typical_value,
        calories: req.body.calories,
        carbs: req.body.carbs,
        fat: req.body.fat,
        protein: req.body.protein,
        salt: req.body.salt,
        sugar: req.body.sugar


        });
        client.close();
        res.send('<h1 style="font-family:arial; font-size:80px;text-align:center;"> This Food Is Added To The Database<br></h1> <p style="font-family:courier;font-size:50px;color:indianred;text-align:center;"> name: '+ req.body.name + '<br>'+  ' value: '+ req.body.typical_values_per + '<br>'+  ' unit: '+ req.body.unit_of_the_typical_value + '<br>'+  ' calories: '+ req.body.calories + '<br>'+  ' carbs: '+ req.body.carbs + '<br>'+ ' fat: '+ req.body.fat +'<br>'+  ' protein: '+ req.body.protein +'<br>'+  ' salt: '+ req.body.salt +'<br>'+ ' sugar: '+ req.body.sugar +'<br />'+'<a href='+'./'+'>Home</a></p>');
        });
        });
       });

//about page
     app.get('/about',function(req,res){
        res.render('about.html');
    });

//search page
    app.get('/search', function(req,res){

         res.render("search.html");
    
     });
          //search the book database
                                                                          
    app.get('/search-result', function (req,res) {                                                                          
       // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
       //connecting to mongodb

       MongoClient.connect(url, function(err, client) {
        if (err) throw err;
        var db = client.db ('caloriebuddydb');
	 var testing =req.query.keyword;

        if (testing === ""|| testing ===" " ){
           res.send('<h1 style="font-family:arial; font-size:60px;text-align:center;">The Item Cannot Be Found In Our Database <br> <br>'+ '<br />'+'<a href='+'./'+'>Home</a></h1>')
                           }
        else{
//comparing name to keyword entered in form
        db.collection('food').find({ 'name': {'$regex': req.query.keyword, '$options': 'i'}}).toArray((findErr, results) =>{
      if (findErr) throw findErr;
      else
         res.render('sresult.ejs', {food:results});
      client.close();
      });
	}
        });
       });    
	
    
  //register page
     app.get('/register', function (req,res) {
         res.render('register.html');
	                                                                     
      });                                                                                                 

    //registered page

 app.post('/registered',[check('email').isEmail()],[check('password').isLength({ min: 8 })]  , function (req,res) {

const errors = validationResult(req);

        if (!errors.isEmpty()) {

          res.redirect('./register'); }

       else { // the rest of the code for registered route
//bcrypt cont values
const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = req.sanitize(req.body.password);
      // saving data in database
       var MongoClient = require('mongodb').MongoClient;
       var url = 'mongodb://localhost';
bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
   // Store hashed password in your database.
 hashedPassword:req.body.password;

       MongoClient.connect(url, function(err, client){

        if (err) throw err;
        var db = client.db ('caloriebuddydb');		//inserting form data into database
        db.collection('users').insertOne({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email

        });
         client.close();});

        res.send('<h1 style="font-family:arial; font-size:80px;text-align:center;"> You Are Now Registered<br></h1><p style="font-family:courier;font-size:50px; color:indianred;text-align:center;">Your Username Is: '+ req.body.username + '<br>'+  ' Your Password Is: '+ req.body.password +'<br>'+ 'Your Hashed Password is: '+ hashedPassword + '<br />'+'<a href='+'./'+'>Home</a></p>');
        
});
}
       });                                                                       
 
}//------------------------------ END------------------------------------------------------------------
                                                                    
       
