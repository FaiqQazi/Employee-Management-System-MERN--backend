const express = require('express');
const app = express();
const cors=require('cors');
const connecttomongo = require('./db.js'); // Import the function, not its invocation

connecttomongo(); // Call the function to connect to MongoDB
const port=5001;


app.use(express.json())
app.use(cors());
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/tasks', require('./routes/taskcontroller.js'))


app.listen(port, () => {
  console.log(`Express server started on port ${port}`);
});
