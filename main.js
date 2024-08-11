import { storage, ref, uploadString, getDownloadURL } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", function() {
    const expenseForm = document.getElementById("expense-form");
    const expenseTableBody = document.getElementById("expense-table-body");
    const totalAnaSpan = document.getElementById("total-ana");
    const totalBeliSpan = document.getElementById("total-beli");
    const totalCamilaSpan = document.getElementById("total-camila");
    const totalElisaSpan = document.getElementById("total-elisa");

    let totalAna = 0;
    let totalBeli = 0;
    let totalCamila = 0;
    let totalElisa = 0;

    document.addEventListener("DOMContentLoaded", function() {
        loadTableData(); // Carrega os dados do Cloud Storage
    });

    function saveTableData() {
        const expenseTableBody = document.getElementById("expense-table-body");
        const rows = expenseTableBody.querySelectorAll("tr");
        let csvContent = "data:text/csv;charset=utf-8,";

        rows.forEach(row => {
            let rowData = [];
            row.querySelectorAll("td").forEach(cell => {
                rowData.push(cell.textContent);
            });
            csvContent += rowData.join(",") + "\n";
        });

        const storageRef = ref(storage, 'expense_data.csv');

        uploadString(storageRef, csvContent, 'data_url')
            .then(() => {
                console.log("Dados salvos no Cloud Storage!");
            })
            .catch((error) => {
                console.error("Erro ao salvar os dados:", error);
            });
    }

    function loadTableData() {
        const storageRef = ref(storage, 'expense_data.csv');

        getDownloadURL(storageRef)
            .then((url) => {
                fetch(url)
                    .then(response => response.text())
                    .then(csvText => {
                        populateTable(csvText);
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar os dados:", error);
                    });
            })
            .catch((error) => {
                console.error("Erro ao obter a URL do arquivo:", error);
            });
    }

    function populateTable(csvText) {
        const expenseTableBody = document.getElementById("expense-table-body");
        const rows = csvText.split("\n");

        rows.forEach(row => {
            if (row.trim() !== "") {
                const cols = row.split(",");
                const newRow = document.createElement("tr");

                cols.forEach(col => {
                    const cell = document.createElement("td");
                    cell.textContent = col;
                    newRow.appendChild(cell);
                });

                const deleteButtonCell = document.createElement("td");
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "X";
                deleteButton.classList.add("delete-button");
                deleteButtonCell.appendChild(deleteButton);
                newRow.appendChild(deleteButtonCell);

                expenseTableBody.appendChild(newRow);
            }
        });
    }

    function updateConstantExpenses() {
        const aluguel = parseFloat(document.getElementById("aluguel").textContent.replace('R$', '').replace(',', '.'));
        const condominio = parseFloat(document.getElementById("condominio").textContent.replace('R$', '').replace(',', '.'));
        const energia = parseFloat(document.getElementById("energia").textContent.replace('R$', '').replace(',', '.'));
        const totalConstant = aluguel + condominio + energia;
        const dividedAmount = (totalConstant / 4).toFixed(2);

        totalAna += parseFloat(dividedAmount);
        totalBeli += parseFloat(dividedAmount);
        totalCamila += parseFloat(dividedAmount);
        totalElisa += parseFloat(dividedAmount);

        totalAnaSpan.textContent = totalAna.toFixed(2);
        totalBeliSpan.textContent = totalBeli.toFixed(2);
        totalCamilaSpan.textContent = totalCamila.toFixed(2);
        totalElisaSpan.textContent = totalElisa.toFixed(2);
    }

    function handleExpenseFormSubmit(e) {
        e.preventDefault();

        saveTableData();

        const expenseName = document.getElementById("expense-name").value;
        const expenseAmount = parseFloat(document.getElementById("expense-amount").value.replace(',', '.'));
        const selectedRadio = document.querySelector("input[name='expense-owner']:checked");
        const checkedBoxes = document.querySelectorAll("input[name='expense-participant']:checked");

        if (!selectedRadio) {
            alert("Selecione quem pagou!");
            return;
        }

        const owner = selectedRadio.value;
        const others = Array.from(checkedBoxes).map(cb => cb.value);
        const dividedAmount = (expenseAmount / others.length).toFixed(2);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expenseName}</td>
            <td>${others.includes('ana') ? `R$ ${dividedAmount}` : `R$ 0.00`}</td>
            <td>${others.includes('beli') ? `R$ ${dividedAmount}` : `R$ 0.00`}</td>
            <td>${others.includes('camila') ? `R$ ${dividedAmount}` : `R$ 0.00`}</td>
            <td>${others.includes('elisa') ? `R$ ${dividedAmount}` : `R$ 0.00`}</td>
            <td><button class="delete-button">X</button></td>
        `;

        expenseTableBody.appendChild(row);

        const totalDividedAmount = parseFloat(dividedAmount);

        if (owner === 'ana') totalAna -= expenseAmount;
        if (others.includes('ana')) totalAna += totalDividedAmount;
        if (owner === 'beli') totalBeli -= expenseAmount;
        if (others.includes('beli')) totalBeli += totalDividedAmount;
        if (owner === 'camila') totalCamila -= expenseAmount;
        if (others.includes('camila')) totalCamila += totalDividedAmount;
        if (owner === 'elisa') totalElisa -= expenseAmount;
        if (others.includes('elisa')) totalElisa += totalDividedAmount;

        totalAnaSpan.textContent = totalAna.toFixed(2);
        totalBeliSpan.textContent = totalBeli.toFixed(2);
        totalCamilaSpan.textContent = totalCamila.toFixed(2);
        totalElisaSpan.textContent = totalElisa.toFixed(2);

        expenseForm.reset();
    }

    function handleDeleteButtonClick(e) {
        if (e.target.classList.contains("delete-button")) {
            const row = e.target.closest("tr");
            const amountCells = row.querySelectorAll("td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5)");
            const expenseAmounts = Array.from(amountCells).map(cell => parseFloat(cell.textContent.replace("R$ ", "").replace(',', '.')));

            const selectedRadio = document.querySelector("input[name='expense-owner']:checked");
            const owner = selectedRadio ? selectedRadio.value : null;

            const totalExpense = expenseAmounts.reduce((acc, val) => acc + val, 0);

            if (owner === 'ana') totalAna += totalExpense;
            if (owner === 'beli') totalBeli += totalExpense;
            if (owner === 'camila') totalCamila += totalExpense;
            if (owner === 'elisa') totalElisa += totalExpense;

            totalAna -= expenseAmounts[0];
            totalBeli -= expenseAmounts[1];
            totalCamila -= expenseAmounts[2];
            totalElisa -= expenseAmounts[3];

            totalAnaSpan.textContent = totalAna.toFixed(2);
            totalBeliSpan.textContent = totalBeli.toFixed(2);
            totalCamilaSpan.textContent = totalCamila.toFixed(2);
            totalElisaSpan.textContent = totalElisa.toFixed(2);

            row.remove();
            saveTableData();
        }
    }

    updateConstantExpenses();
    expenseForm.addEventListener("submit", handleExpenseFormSubmit);
    expenseTableBody.addEventListener("click", handleDeleteButtonClick);
});
