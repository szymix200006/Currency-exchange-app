const convertButton = document.querySelector('.convert-button');
const finalAmountContainer = document.querySelector('.final-amount');
const dataLists = document.querySelectorAll('#currencies-list');
const amountInput = document.querySelector('.amount-input>input');
const currencyFromInput = document.querySelector('.currency-from-input>input');
const currencyToInput = document.querySelector('.currency-to-input>input');
const appContainer = document.querySelector('.app-container');
const changeButton = document.querySelector('.change-button');

async function collectApiData(url) {
    const response = await fetch(url);
    const currencyInfo = await response.json();
    try {
        if(currencyInfo.message != 'not found') {
            return currencyInfo;
        } else {
            createErrorDiv(currencyInfo.message, 'close');
        }
    } catch(error) {
        createErrorDiv(error, 'close');
    }
}

async function convertMoney(url) {
    const data = await collectApiData(url);
    processExchangeData(data);
}

async function fillDataList(url) {
    const apiResponse = await collectApiData(url);
    dataLists.forEach(dataList => {
        for(el of Object.keys(apiResponse)) {
            const listEl = document.createElement('option');
            listEl.innerHTML = el;
            dataList.appendChild(listEl);
        }
    })
}

function processExchangeData(apiResponse) {
    console.log(apiResponse)
    finalAmountContainer.innerHTML = `${Object.values(apiResponse.rates)[0].toFixed(2)} ${Object.keys(apiResponse.rates)[0]}<br>
                                        Rate: ${(Object.values(apiResponse.rates)[0] / apiResponse.amount).toFixed(2)}`;
}

function createErrorDiv(message, ...buttons) {
    const errorBox = document.createElement('div');
    errorBox.innerHTML = `<span>${message}</span>`;
    errorBox.classList.add('error-div');
    for(el of buttons){
        const button = createButton(buttons[0], 'error-buttons');
        errorBox.append(button);
    }
    appContainer.append(errorBox);
}

function createButton(mess, cl) {
    const button = document.createElement('button');
    button.innerHTML = mess;
    button.classList.add(cl);
    button.addEventListener('click', () => {
        button.parentElement.remove();
        finalAmountContainer.innerHTML = "";
        amountInput.value = "";
        currencyFromInput.value = "";
        currencyToInput.value = "";
    });
    return button;
}

convertButton.addEventListener('click', () => {
    convertMoney(`https://api.frankfurter.app/latest?amount=${amountInput.value}&from=${currencyFromInput.value}&to=${currencyToInput.value}`);
});

function changeCurrencies() {
    convertMoney(`https://api.frankfurter.app/latest?amount=${amountInput.value}&from=${currencyToInput.value}&to=${currencyFromInput.value}`);
    const archiveCurrencyFromValue = currencyFromInput.value
    currencyFromInput.value = currencyToInput.value;
    currencyToInput.value = archiveCurrencyFromValue;
}

changeButton.addEventListener('click', changeCurrencies);

window.onload = () => {
    fillDataList(`https://api.frankfurter.app/currencies`);
}

