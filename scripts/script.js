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

    function updateConstantExpenses() {
        const aluguel = parseFloat(document.getElementById("aluguel").textContent.replace('R$', '').replace(',', '.'));
        const condominio = parseFloat(document.getElementById("condominio").textContent.replace('R$', '').replace(',', '.'));
        const energia = parseFloat(document.getElementById("internet").textContent.replace('R$', '').replace(',', '.'));

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

        // Atualizar os totais
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

            // Subtrair os valores das colunas correspondentes
            totalAna -= expenseAmounts[0];
            totalBeli -= expenseAmounts[1];
            totalCamila -= expenseAmounts[2];
            totalElisa -= expenseAmounts[3];

            totalAnaSpan.textContent = totalAna.toFixed(2);
            totalBeliSpan.textContent = totalBeli.toFixed(2);
            totalCamilaSpan.textContent = totalCamila.toFixed(2);
            totalElisaSpan.textContent = totalElisa.toFixed(2);

            row.remove();
        }
    }

    // Inicializar as despesas constantes na carga da página
    updateConstantExpenses();

    expenseForm.addEventListener("submit", handleExpenseFormSubmit);
    expenseTableBody.addEventListener("click", handleDeleteButtonClick);
});
