'use strict';

// getting elements from HTML file
const loginWrapper = document.querySelector('.wrapper');
const bankWrapper = document.querySelector('.bankWrapper');
const submit = document.querySelector('.submit');
const userLogin = document.querySelector('.userLogin');
const pinLogin = document.querySelector('.pinLogin');
const dataLeft = document.querySelector('.dataLeft');
const balanceNum = document.querySelector('.balanceNum');
const moneyIN = document.querySelector('#in');
const moneyOUT = document.querySelector('#out');
const bankInterest = document.querySelector('#int');
const transferSubmit = document.querySelector('.transferSubmit');
const closeSubmit = document.querySelector('.closeSubmit');
const transferInput = document.querySelector('.clientNN');
const transferAmount = document.querySelector('.clientAmount');
const closeUserInput = document.querySelector('#workJS');
const closePincodeInput = document.querySelector('#workJS--2');
const loanAmountInput = document.querySelector('#reqLoan');
const loanSubmit = document.querySelector('.loanSubmit');
const date = document.querySelector('.date');

let welcomeMessage = document.querySelector('#welcomeName');

// all accounts & data  for this app
const bank = {
    money: 50000,
};

const user1 = {
    name: 'Ajdin Kahric',
    pinCode: 2509,
    movements: [-355, 1680, -200, -110, 800, -250, -100, 325],
    interestRate: 1.5,
    creditScore: 749,
    movementsDates: ['2019-11-18T21:31:17.178Z', '2019-12-23T07:42:02.383Z', '2020-01-28T09:15:04.904Z', '2020-04-01T10:17:24.185Z', '2020-05-08T14:11:59.604Z', '2021-05-27T17:01:17.194Z', '2022-11-11T23:36:17.929Z', '2022-11-16T10:51:36.790Z'],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const user2 = {
    name: 'Tamp Leon',
    pinCode: 4444,
    movements: [356, 188, -280, 310, 200, 559, -310, 395],
    interestRate: 2,
    creditScore: 250,
    movementsDates: ['2019-11-01T13:15:33.035Z', '2019-11-30T09:48:16.867Z', '2019-12-25T06:04:23.907Z', '2020-01-25T14:18:46.235Z', '2020-02-05T16:33:06.386Z', '2020-04-10T14:43:26.374Z', '2020-06-25T18:49:59.371Z', '2020-07-26T12:01:20.894Z'],
    currency: 'USD',
    locale: 'en-US',
};

const users = [user1, user2];
// --------------------------------------------

// this will create initials for every account user
const getNN = function (users) {
    users.forEach((user) => {
        user.nn = user.name
            .toLowerCase()
            .split(' ')
            .map((name) => name[0])
            .join('');
    });
};
getNN(users);

const formatDate = function (date) {
    const calcDay = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const dayPass = calcDay(new Date(), date);

    if (dayPass === 0) return 'Today';
    if (dayPass === 1) return 'Yesterday';
    if (dayPass <= 7) return `${dayPass} days ago`;

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// every movement that happens in user account will be shown in html using this function
const show = function (curUser) {
    dataLeft.innerHTML = '';

    curUser.movements.forEach((movement, i) => {
        const typeOf = movement > 0 ? 'deposit' : 'withdraw';

        const date = new Date(curUser.movementsDates[i]);
        const showDate = formatDate(date);

        const push = `
            <div class="info">
                <div class="action ${typeOf}">${typeOf}</div>
                <div class="date">${showDate}</div>
                <div class="transfer">${movement} $</div>
            </div>
        `;
        dataLeft.insertAdjacentHTML('afterbegin', push);
    });
};

// based on movements, we display current balance
const displayCurrBalance = function (acc) {
    const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    balanceNum.innerHTML = `${balance}$`;
    acc.balance = balance;
};

// function that will tell how much money went into user account and how much money went out. Also bank interest
const displayTrancMoney = function (arr) {
    // displaying deposits
    const deposit = arr.movements.filter((movement) => movement > 0).reduce((acc, movement) => acc + movement, 0);
    moneyIN.textContent = `${deposit} $`;

    // displaying withdrawals
    const withdraw = arr.movements.filter((movement) => movement < 0).reduce((acc, movement) => acc + movement, 0);
    moneyOUT.textContent = `${Math.abs(withdraw)} $`;

    // displaying & calculating bank interest
    const interest = arr.movements
        .filter((movement) => movement > 0)
        .map((dep) => (dep * arr.interestRate) / 100)
        .reduce((acc, int) => acc + int, 0);
    bankInterest.textContent = `${+interest.toFixed(2)} $`;
};

const updateUI = function () {
    // displaying current balance of active account
    displayCurrBalance(curUser);

    // displaying movement history of active account
    show(curUser);

    //displaying how much money we got in and out of active account
    displayTrancMoney(curUser);
};

let curUser;
submit.addEventListener('click', function () {
    curUser = users.find((user) => user.nn === userLogin.value);

    if (curUser?.pinCode === +pinLogin.value) {
        // switch between login UI and bankapp UI
        loginWrapper.style.display = 'none';
        bankWrapper.style.display = 'block';
        welcomeMessage.textContent = `${curUser.name.split(' ')[0]}`;

        updateUI();
    } else {
        // work on this code after - basiclly it needs to say something when we type wrong login info
    }
});

// transfering money from one acc to another
transferSubmit.addEventListener('click', function () {
    const amount = +transferAmount.value;
    const client = users.find((acc) => acc.nn === transferInput.value);

    if (curUser.nn !== transferInput.value && transferAmount.value > 0 && curUser.balance >= transferAmount.value && client) {
        curUser.movements.push(-amount);
        client.movements.push(amount);

        curUser.movementsDates.push(new Date().toISOString());
        client.movementsDates.push(new Date().toISOString());
        curUser.creditScore += 100;

        updateUI();

        transferInput.value = transferAmount.value = '';
    }
});

// closing curUser account
closeSubmit.addEventListener('click', function () {
    if (closeUserInput.value === curUser.nn && +closePincodeInput.value === curUser.pinCode) {
        const test = users.findIndex((acc) => acc.nn === closeUserInput.value);

        users.splice(test, 1);
        pinLogin.value = userLogin.value = '';
        closeUserInput.value = closePincodeInput.value = '';

        loginWrapper.style.display = 'block';
        bankWrapper.style.display = 'none';
    }
});

// asking for loan
loanSubmit.addEventListener('click', function () {
    const reqAmount = +loanAmountInput.value;

    if (curUser.creditScore > 600 && bank.money >= reqAmount) {
        curUser.movements.push(reqAmount);

        curUser.movementsDates.push(new Date().toISOString());

        bank.money -= reqAmount;
        curUser.creditScore -= 100;

        updateUI();

        loanAmountInput.value = '';
    }
});
