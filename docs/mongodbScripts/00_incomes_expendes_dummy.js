var incomes = [];
var expenses = [];

var incomesTypes = ['Salary', 'Freelance', 'Payouts', 'Others'];
var expensesTypes = ['Food', 'Health', 'Home', 'Education', 'Entertaiment', 'Others'];


for (var i  =0; i < 100; i++)
{
    var IncomeDoc = {
        description: `Income Test # ${i + 1}.`,
        date: new Date().toISOString(),
        created: new Date().toISOString(),
        type: 'INCOME',
        category: incomesTypes[Math.floor(Math.random()*3)],
        amount: Math.round(Math.random() * 100000) / 100
    };
    incomes.push(IncomeDoc);
}



for (var i  =0; i < 100; i++)
{
    var expenseDoc = {
        description: `Expense Test # ${i + 1}.`,
        date: new Date().toISOString(),
        created: new Date().toISOString(),
        type: 'EXPENSE',
        category: expensesTypes[Math.floor(Math.random()*5)],
        amount: Math.round(Math.random() * 100000) / 100
    };
    expenses.push(expenseDoc);
}

db.cashFlow.insert(incomes);
db.cashFlow.insert(expenses);


