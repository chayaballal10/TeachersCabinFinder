const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Teacher = require('./models/Teacher'); // Ensure this points to your correct model file
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Load the Excel file
const filePath = './staff.xlsx'; // Ensure the file path is correct
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Print data before inserting
console.log("Extracted Data from Excel:", data);

// Check if all required fields exist
const isValidData = data.every(row => row.name && row.floor && row.building && row.branch);

if (!isValidData) {
    console.error('❌ Data validation failed: Some required fields are missing.');
    process.exit(1);
}

// Insert data into MongoDB
const importData = async () => {
    try {
        await Teacher.deleteMany(); // Optional: Clears previous data
        await Teacher.insertMany(data);
        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error importing data:', error);
        process.exit(1);
    }
};

importData();
