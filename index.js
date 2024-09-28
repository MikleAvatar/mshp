let express = require(`express`);
let app = express();
let port = 3005;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
});

// Настройка CORS
let cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));


// Настройка POST-запроса — JSON
// app.use(express.static('public'));
app.use(express.json());

// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/project');

//Схема
let schema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    image: String,
    isMine: Boolean,
}, { 
    timestamps: true 
});

let schema2 = new mongoose.Schema({
    author: String,
    description: String,
    isMine: Boolean,
}, { 
    timestamps: true 
});

let Slide = mongoose.model('slide', schema);
let Review = mongoose.model('review', schema2);

//  Получение изображений
app.get(`/`, async function (req, res) {
    let title = req.query.title;
    let category = req.query.category;
    let search = {};
    if (category) {
        search.category=category;
    }
    let data = await Slide.find(search);
    res.send(data);
});

//  Получение отзывов
app.get(`/reviews`, async function (req, res) {
    let data = await Review.find();
    res.send(data);
});

//Новое изображение
app.post(`/`, async function (req, res) {
    let title = req.body.title;
    let category= req.body.category;
    let description = req.body.description;
    let image= req.body.image;


    let slide = new Slide({
        title:title,
        category:category,
        description:description,
        image:image,
        isMine:true,
    })
    await slide.save()
    res.sendStatus(200)

});

//Новый отзыв
app.post(`/reviews`, async function (req, res) {
    let author = req.body.author;
    let description = req.body.description;

    let review = new Review({
        author:author,
        description:description,
        isMine:true,
    })
    await review.save()
    res.sendStatus(200)

});

// Удаление
app.delete(`/reviews`, async function (req, res) {
    let id = req.query.id;
    await Review.deleteOne({_id:id});
    res.sendStatus(200)
    });