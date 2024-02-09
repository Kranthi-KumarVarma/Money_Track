document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const transactionsContainer = document.getElementById('transactions');
    const netAmountContainer = document.getElementById('netAmount');
    const clearButton = document.getElementById('clearButton');

    transactionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const type = document.getElementById('type').value;

        // Add the new transaction to the database
        await fetch('/addTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, description, type }),
        });

        // Update the displayed transactions and net amount
        fetchTransactions();

        // Clear the form fields
        clearFormFields();
    });

    clearButton.addEventListener('click', async () => {
        // Clear all transactions when the button is clicked
        await fetch('/clearTransactions', { method: 'GET' });

        // Fetch transactions and net amount after clearing
        fetchTransactions();
    });

    // Fetch transactions and net amount on page load
    fetchTransactions();

    async function fetchTransactions() {
        // Fetch transactions and net amount from the server
        const response = await fetch('/getTransactions');
        const { transactions, netAmount } = await response.json();

        // Update the displayed transactions
        updateTransactionUI(transactions);

        // Display the net amount
        displayNetAmount(netAmount);
    }

    function updateTransactionUI(transactions) {
        transactionsContainer.innerHTML = '';

        transactions.forEach((transaction) => {
            const transactionElement = document.createElement('div');
            transactionElement.classList.add('transaction', transaction.type);
            transactionElement.innerHTML = `
                <span>${transaction.description}</span>
                <span>${transaction.type === 'expense' ? '-' : '+'}Rs. ${transaction.amount}</span>
            `;
            transactionsContainer.appendChild(transactionElement);
        });
    }

    function displayNetAmount(netAmount) {
        netAmountContainer.textContent = `Net Amount: Rs/-${netAmount}`;
    }

    function clearFormFields() {
        // Clear the form fields
        document.getElementById('amount').value = '';
        document.getElementById('description').value = '';
        document.getElementById('type').value = 'income';
    }
});
