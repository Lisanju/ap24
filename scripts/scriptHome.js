// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB54-JPIKrtcZn_EHN8yzduIkdpttZEQb8",
  authDomain: "ap24-82825.firebaseapp.com",
  databaseURL: "https://ap24-82825-default-rtdb.firebaseio.com",
  projectId: "ap24-82825",
  storageBucket: "ap24-82825.appspot.com",
  messagingSenderId: "553997269558",
  appId: "1:553997269558:web:01f33458878f20dc267697",
  measurementId: "G-LNMQ3CTKJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

document.addEventListener('DOMContentLoaded', async () => {
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

    // Carrega as despesas do Firestore ao inicializar a página
    await loadExpenses();

    expenseForm.addEventListener('submit', async function(event) {
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

        // Adiciona a despesa ao Firestore
        await addExpenseToFirestore(expenseName, expenseOwner, participants, expenseAmount);

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

    async function addExpenseToFirestore(name, owner, participants, amount) {
        try {
            await addDoc(collection(db, "expenses"), {
                name: name,
                owner: owner,
                participants: participants,
                amount: amount
            });
            console.log("Documento adicionado ao Firestore.");
        } catch (e) {
            console.error("Erro ao adicionar documento: ", e);
        }
    }

    async function loadExpenses() {
        try {
            const querySnapshot = await getDocs(collection(db, "expenses"));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                addExpenseToTable(data.name, data.owner, data.participants, data.amount);

                const splitAmount = data.amount / data.participants.length;
                data.participants.forEach(participant => {
                    totals[participant] += splitAmount;
                });

                totals[data.owner] -= data.amount;
                updateTotals();
            });
        } catch (e) {
            console.error("Erro ao carregar documentos: ", e);
        }
    }
});
