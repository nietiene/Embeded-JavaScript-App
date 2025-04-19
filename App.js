const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// SetUp Middleware
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// Display data in Ejs file
app.get('/', (req, res) => {
  res.render("index", {name: 'Etiene'});
});

const users = [{
  id: 1,
  name: 'Etiene',
  place: 'Bugesera'
},{
  id: 2,
  name: 'Jonas',
  place: 'Bugesera'
},{
  id: 3,
  name: 'Eric',
  place: 'gisagara'
}];

// System Will Display userInfo.ejs
app.get('/user', (req, res) => {
    res.render("userInfo", {user: users});
});

// System Will dispay Form
app.get('/Add', (req, res) => {
  res.render("AddForm");
})

//System will get Id of user if it is valid it will display form to edit
app.get('/edit/:id', (req, res) => {

  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id); // This variable is used to update user 
  if (user) {
    res.render("editForm", {user});   
  } else {
    res.status(404).send("User Not Found");
  }
 
});


// insert data In Postman
app.post('/user', (req, res) => {
  try {

  const {id, name, place} = req.body;
  if (!id || !name || !place) {
    res.status(404).json({message:"missed id, name, place"});
  } 

 const existData = users.some(users => users.id === id);

 if (existData) {
     res.status(400).json(`Data with Id ${id} already exist`);
 }

 const newUser =  {id, name, place};
 users.push(newUser);
  if (users) {
    res.status(200).json({message:"Data Inserted", user: newUser});
  } else {
    res.status(500).json({message:"Data not inserted",});
  }
} catch (err) {
  res.status(500).json({message:"Data not inserted",Error: err.message});
}
});

// System will  Add user in dataset and go back to user page
app.post('/Add', (req, res) => {
  const {id, name, place} = req.body;
  const newData = {id: parseInt(id), name, place};

  if (newData) {
    users.push(newData);
    res.redirect("/user");
  }
});

// system perform update operation
app.post('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(index => index.id === id);

  if (index != -1) {
     users[index] = {...users[index], ...req.body};
     res.redirect("/user"); // back to user page
  } else {
    res.status(404).send("User Not Found");
  }
});
// Delete In PostMan
app.delete('/user/:id', (req, res) => {
  try {
  const id = parseInt(req.params.id);
  const index = users.findIndex(users => users.id === id);

  if (index != -1) {
    const deleted = users.splice(index, 1);
    res.status(200).json({message: "user's info deleted", deleted});
  }
} catch (err) {
  res.status(404).json({message:"user's info not deleted",error: err.message});
}
});

// Update in postMan
app.put('/user/:id', (req, res) => {
try {
  const id = parseInt(req.params.id);
  const index = users.findIndex(users => users.id === id);

  if (index != -1) {
     users[index] = {...users[index], ...req.body};
     res.status(200).json(users);
  }
} catch (err) {
  res.status(404).json({message: "Not found", error:err.message});
}
});

// Delete user in database and go back to user page
app.get('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(users => users.id === id);

  if (index != -1) {
     users.splice(index, 1);
     res.redirect("/user");
  } else {
    res.status(404).json("User Not found");
  }
});

app.listen(3000, () => console.log("http://localhost:3000"));


