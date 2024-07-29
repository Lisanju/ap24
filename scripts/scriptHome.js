document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseTableBody = document.getElementById('expense-table-body');
    const totals = {
        ana: 0,
        beli: 0,
        camila: 0,
        elisa: 0
    };

    const aluguel = parseFloat(document.getElementById('aluguel').textContent.replace(',', '.'));
    const condominio = parseFloat(document.getElementById('condominio').textContent.replace(',', '.'));
    const internet = parseFloat(document.getElementById('internet').textContent.replace(',', '.'));

    const constantTotal = (aluguel + condominio + internet) / 4;

    // Adiciona os valores constantes aos totais iniciais
    ['ana', 'beli', 'camila', 'elisa'].forEach(person => {
        totals[person] = constantTotal;
    });

    updateTotals();

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const expenseName = document.getElementById('expense-name').value;
        let expenseAmount = document.getElementById('expense-amount').value;

        // Substitui a vírgula por ponto e converte para float
        expenseAmount = parseFloat(expenseAmount.replace(',', '.'));

        const expenseOwner = document.querySelector('input[name="expense-owner"]:checked').value;
        const participants = Array.from(document.querySelectorAll('input[name="expense-participant"]:checked')).map(input => input.value);

        if (!expenseName || isNaN(expenseAmount) || !expenseOwner || participants.length === 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const splitAmount = expenseAmount / participants.length;

        // Atualiza os totais de cada pessoa
        participants.forEach(participant => {
            totals[participant] += splitAmount;
        });

        totals[expenseOwner] -= expenseAmount;

        updateTotals();
        addExpenseToTable(expenseName, expenseOwner, participants, expenseAmount);

        expenseForm.reset();
    });

    function updateTotals() {
        document.getElementById('total-ana').textContent = formatCurrency(totals.ana);
        document.getElementById('total-beli').textContent = formatCurrency(totals.beli);
        document.getElementById('total-camila').textContent = formatCurrency(totals.camila);
        document.getElementById('total-elisa').textContent = formatCurrency(totals.elisa);
    }

    function addExpenseToTable(name, owner, participants, amount) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${participants.includes('ana') ? formatCurrency(amount / participants.length) : '-'}</td>
            <td>${participants.includes('beli') ? formatCurrency(amount / participants.length) : '-'}</td>
            <td>${participants.includes('camila') ? formatCurrency(amount / participants.length) : '-'}</td>
            <td>${participants.includes('elisa') ? formatCurrency(amount / participants.length) : '-'}</td>
            <td><button class="delete-expense">X</button></td>
        `;
        expenseTableBody.appendChild(row);

        row.querySelector('.delete-expense').addEventListener('click', () => {
            removeExpense(row, owner, participants, amount);
        });
    }

    function removeExpense(row, owner, participants, amount) {
        const splitAmount = amount / participants.length;

        participants.forEach(participant => {
            totals[participant] -= splitAmount;
        });

        totals[owner] += amount;

        updateTotals();
        row.remove();
    }

    function formatCurrency(value) {
        return 'R$ ' + value.toFixed(2).replace('.', ',');
    }
});
