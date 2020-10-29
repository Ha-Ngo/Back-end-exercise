require('dotenv').config();

const mongoose = require('mongoose');
const Items = require('./models/item');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db=mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

//Set data
const data = async () => {
    await Items.deleteMany({});
    for(let i = 0; i<15; i++){
        const item = new Items ({
            name: `Shoes${i}`, 
            price: `${i}`, 
            description: `Size${i}`
        });
        await item.save();
}
}   

data().then(() => {
    mongoose.connection.close()
})