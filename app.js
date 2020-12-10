require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Items = require('./models/item');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const alert = require('alert');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db=mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

//Homepage
app.get('/', (req,res) => {
    res.render('home')
})

//Getting All Items
app.get('/store', async (req,res) => {
    const items = await Items.find({});
    res.render('store',{items})
})

//Getting One Item
app.get('/store/item/:id', catchAsync(async (req,res) => {
    const item = await Items.findById(req.params.id);
    res.render('show', {item})
}))

//Searching for Item based on Name
app.get('/searchItem', catchAsync(async(req,res) => {
    const searchParam = req.query.searchTerm;
    const item = await Items.findOne({name:searchParam});
    if(item) {
        res.render('show', {item})
    } else {
        alert('no item was found')
        res.render('search')
    }
}))

app.get('/search', catchAsync(async(req,res) => {
    res.render('search')
}))

//Adding New Item
app.get('/additems', async (req,res) => {
    res.render('addItems')
})

app.post('/newItem', catchAsync(async (req,res) => {
    const item = new Items(req.body.item);
    await item.save()
    res.redirect(`/store/item/${item._id}`)
}))

//Edit Item
app.get('/store/item/:id/edit', catchAsync(async (req,res) => {
    const item = await Items.findById(req.params.id);
    res.render('edit',{item})
}))

app.put('/store/item/:id',catchAsync (async (req,res) => {
    const {id} = req.params;
    const item = await Items.findByIdAndUpdate(id, {...req.body.item});
    res.redirect(`/store/item/${item._id}`)
}))

//Delete Item
app.delete('/store/item/:id',catchAsync (async (req,res) => {
    const {id} = req.params;
    await Items.findByIdAndDelete(id);
    res.redirect('/store')
}))

app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not found', 404))
})

app.use((err,req,res,next) => {
    const { statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).send(message)
})

app.listen(5500, () => {
    console.log ("Web serving!!!!")
} )