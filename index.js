const { MongoClient } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yohkm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("doctor-patient-management");
        const usersCollection = database.collection('users');
        const patientsCollection = database.collection('patients');
        const doctorsCollection = database.collection('doctors');

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        app.post('/patients', async (req, res) => {
            console.log(req.body);
            const name = req.body.name;
            const email = req.body.email;
            const role = req.body.role;
            const dateOfBirth = req.body.dateOfBirth;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const user = {
                name,
                email,
                role,
                dateOfBirth,
                image: imageBuffer
            }
            const result = await patientsCollection.insertOne(user);
            res.json(result)
        });
        app.post('/doctors', async (req, res) => {
            console.log(req.body);
            const name = req.body.name;
            const email = req.body.email;
            const role = req.body.role;
            const dateOfBirth = req.body.dateOfBirth;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const user = {
                name,
                email,
                role,
                dateOfBirth,
                image: imageBuffer
            }
            const result = await doctorsCollection.insertOne(user);
            res.json(result)
        });


        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            res.send(user);
        });


        /*  //GET API

        
         app.get('/packages', async (req, res) => {
             const cursor = packageCollection.find({});
             const packages = await cursor.toArray();
             res.send(packages);
         });
 
         app.get('/packages/:id', async (req, res) => {
             const id = req.params.id;
             const query = { _id: ObjectId(id) };
             const package = await packageCollection.findOne(query);
             res.send(package);
         });
 
 
         app.get('/bookings', async (req, res) => {
             const cursor = bookingCollection.find({});
             const bookings = await cursor.toArray();
             res.send(bookings);
         });
 
         app.get('/bookings/:uid', async (req, res) => {
             const uid = [req.params.uid];
             const query = { uid: { $in: uid } };
             const booking = await bookingCollection.find(query).toArray();
             res.send(booking);
         });
 
         app.get('/services', async (req, res) => {
             const cursor = serviceCollection.find({});
             const services = await cursor.toArray();
             res.send(services);
         });
 
         app.get('/reviews', async (req, res) => {
             const cursor = reviewCollection.find({});
             const reviews = await cursor.toArray();
             res.send(reviews);
         });
 
         //post
         app.post('/bookings', async (req, res) => {
             const order = req.body;
             const booking = await bookingCollection.insertOne(order)
             res.json(booking);
         });
 
         app.post('/packages', async (req, res) => {
             const order = req.body;
             const package = await packageCollection.insertOne(order)
             res.json(package);
         });
 
         app.post('/reviews', async (req, res) => {
             const order = req.body;
             const review = await reviewCollection.insertOne(order)
             res.json(review);
         });
 
         //UPDATE API
         app.put('/bookings/:id', async (req, res) => {
             const id = req.params.id;
             const updatedBooking = req.body;
             const filter = { _id: ObjectId(id) };
             const options = { upsert: true };
             const updateDoc = {
                 $set: {
                     status: "booked"
                 },
             };
             const result = await bookingCollection.updateOne(filter, updateDoc, options)
             console.log('updating', id)
             res.json(result)
         })
 
         // DELETE API
         app.delete('/bookings/:id', async (req, res) => {
             const id = req.params.id;
             const query = { _id: ObjectId(id) };
             const result = await bookingCollection.deleteOne(query);
             res.json(result);
         }); */
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running my CRUD server');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})