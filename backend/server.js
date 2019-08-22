const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 3000;

let Todo = require('./todo.model');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect('mongodb://127.0.0.1:27017/todo',{useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function(){
    console.log("Conexão estabelecida");
});


todoRoutes.route('/').get(function(req, res){
    Todo.find(function(err, todos){
        if(err){
            res.status(500).send({message: 'erro'});
        }else{
            res.status(200).send(todos);
        }
    });
    
});

todoRoutes.route('/:id').get(function(req, res){
    console.log(req.params.id);
    Todo.findById({_id:req.params.id}, function(err, todos){
        if(err){
            res.status(500).send({message: 'erro'});
        }else{
            res.status(200).send(todos);
        }
    })    
})

todoRoutes.route('/').post(function(req, res){
   console.log(req.body);
    var data = new Todo(req.body);
    Todo.create(data).then(resp => {
        res.status(201).send(resp);
    }).catch(err => {
        res.status(500).send({message: err});
    });
})


app.use('/todos',todoRoutes);

app.listen(PORT, function(){
    console.log("Webserver rodando na porta: "+PORT);
});

