const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  level: {
    type: String,
    enum: ['Easy Peasy', 'Amateur Chef', 'UltraPro Chef']
  },
  ingredients: [String],
  cuisine: {
    type: String,
    required: true
  },
  dishType: {
    type: String,
    enum: ['breakfast', 'main_course', 'soup', 'snack', 'drink', 'dessert', 'other']
  },
  image: {
    type: String,
    default: 'https://images.media-allrecipes.com/images/75131.jpg'
  },
  duration: {
    type: Number,
    min: 0
  },
  creator: String,
  created: {
    type: Date,
    default: Date.now
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

const recipes = require('./data.json');

mongoose.set('strictQuery', false);

const MONGODB_URI = 'mongodb://localhost:27017/my-first-database';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected to: "${mongoose.connection.name}"`);
    return Recipe.deleteMany();
  })
  .then(() => {
    return Recipe.create({
      title: 'Lasagna',
      level: 'Easy Peasy',
      ingredients: ['cheese', 'meat', 'tomato', 'mozarella', 'pasta'],
      cuisine: 'Italian',
      dishType: 'main_course',
      image: 'https://thecozycook.com/wp-content/uploads/2022/04/Lasagna-Recipe.jpg',
      duration: 30,
      creator: 'Your Name'
    });
  })
  .then((recipe) => {
    console.log(`Created recipe: ${recipe.title}`);
    return Recipe.insertMany(recipes);
  })
  .then(() => {
    console.log('Inserted multiple recipes:');
    recipes.forEach((recipe) => {
      console.log(recipe.title);
    });

    return Recipe.findOneAndUpdate(
      { title: 'Rigatoni alla Genovese' },
      { duration: 100 },
      { new: true }
    );
  })
  .then(() => {
    console.log('Duration of Rigatoni alla Genovese has changed');
    return Recipe.deleteOne({ title: 'Carrot Cake' });
  })
  .then(() => {
    console.log('Removed Carrot Cake');
    mongoose.connection.close();
    console.log('Database connection closed.');
  })
  .catch((error) => {
    console.error('Error:', error);
  });

