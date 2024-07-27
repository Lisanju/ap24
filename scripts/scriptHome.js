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

    expenseForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const expenseName = document.getElementById("expense-name").value;
        const expenseAmount = parseFloat(document.getElementById("expense-amount").value);
        const selectedRadio = document.querySelector("input[name='expense-owner']:checked");
        const checkedBoxes = document.querySelectorAll("input[name='expense-owner']:checked");

        if (!selectedRadio) {
            alert("Selecione quem pagou!");
            return;
        }

        const owner = selectedRadio.value;
        const others = Array.from(checkedBoxes).map(cb => cb.value).filter(value => value !== owner);
        const dividedAmount = (expenseAmount / others.length).toFixed(2);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expenseName}</td>
            <td>${owner === 'ana' ? `-R$ ${expenseAmount.toFixed(2)}` : (others.includes('ana') ? `R$ ${dividedAmount}` : `R$ 0.00`)}</td>
            <td>${owner === 'beli' ? `-R$ ${expenseAmount.toFixed(2)}` : (others.includes('beli') ? `R$ ${dividedAmount}` : `R$ 0.00`)}</td>
            <td>${owner === 'camila' ? `-R$ ${expenseAmount.toFixed(2)}` : (others.includes('camila') ? `R$ ${dividedAmount}` : `R$ 0.00`)}</td>
            <td>${owner === 'elisa' ? `-R$ ${expenseAmount.toFixed(2)}` : (others.includes('elisa') ? `R$ ${dividedAmount}` : `R$ 0.00`)}</td>
            <td><button class="delete-button">Excluir</button></td>
        `;

        expenseTableBody.appendChild(row);

        // Atualizar os totais
        const totalDividedAmount = parseFloat(dividedAmount);

        if (owner === 'ana') totalAna -= expenseAmount;
        else totalAna += others.includes('ana') ? totalDividedAmount : 0;

        if (owner === 'beli') totalBeli -= expenseAmount;
        else totalBeli += others.includes('beli') ? totalDividedAmount : 0;

        if (owner === 'camila') totalCamila -= expenseAmount;
        else totalCamila += others.includes('camila') ? totalDividedAmount : 0;

        if (owner === 'elisa') totalElisa -= expenseAmount;
        else totalElisa += others.includes('elisa') ? totalDividedAmount : 0;

        totalAnaSpan.textContent = totalAna.toFixed(2);
        totalBeliSpan.textContent = totalBeli.toFixed(2);
        totalCamilaSpan.textContent = totalCamila.toFixed(2);
        totalElisaSpan.textContent = totalElisa.toFixed(2);

        expenseForm.reset();
    });

    expenseTableBody.addEventListener("click", function(e) {
        if (e.target.classList.contains("delete-button")) {
            const row = e.target.closest("tr");
            const amountCells = row.querySelectorAll("td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5)");
            const expenseAmounts = Array.from(amountCells).map(cell => parseFloat(cell.textContent.replace("R$ ", "").replace(",", ".")));

            // Subtrair os valores das colunas correspondentes
            totalAna += expenseAmounts[0];
            totalBeli += expenseAmounts[1];
            totalCamila += expenseAmounts[2];
            totalElisa += expenseAmounts[3];

            totalAnaSpan.textContent = totalAna.toFixed(2);
            totalBeliSpan.textContent = totalBeli.toFixed(2);
            totalCamilaSpan.textContent = totalCamila.toFixed(2);
            totalElisaSpan.textContent = totalElisa.toFixed(2);

            row.remove();
        }
    });
});
