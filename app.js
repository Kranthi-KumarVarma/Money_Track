const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/money-tracker', {
    
});

// Define a schema for transactions
const transactionSchema = new mongoose.Schema({
    amount: Number,
    description: String,
    type: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Set up HTML as the view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Route to clear all transactions in MongoDB
app.get('/clearTransactions', async (req, res) => {
    try {
        // Remove all transactions from the database
        await Transaction.deleteMany({});
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define routes

// Route to get all transactions from MongoDB
app.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        const netAmount = calculateNetAmount(transactions);
        res.render('index', { transactions, netAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a new transaction to MongoDB
app.post('/addTransaction', async (req, res) => {
    const { amount, description, type } = req.body;

    // Create a new transaction in the database
    const newTransaction = new Transaction({ amount, description, type });
    await newTransaction.save();

    res.json({ success: true });
});

// Route to get all transactions from MongoDB
app.get('/getTransactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        const netAmount = calculateNetAmount(transactions);
        res.json({ transactions, netAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper function to calculate net amount
function calculateNetAmount(transactions) {
    const totalIncome = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    return totalIncome - totalExpenses;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
