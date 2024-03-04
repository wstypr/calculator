const display = document.querySelector("#display");
display.freeze = true; //custom freeze property, when true, the display digit is replaced not appended
const equalBtn = document.querySelector(".equalBtn");
let currentDigit;
let currentOperator = {};

// handling click on number button
for (const numBtn of document.querySelectorAll(".numBtn")) {
  numBtn.addEventListener("click", function () {
    displayAddDigit(this.getAttribute("data-value"));
  });
}

// handling click on minus button
const minusBtn = document.querySelector("#minusBtn");
minusBtn.addEventListener("click", () => {
  displayToggleMinus();
});

// handling click on operator number
for (const operatorBtn of document.querySelectorAll(".operatorBtn")) {
  operatorBtn.addEventListener("click", function () {
    if (currentOperator.operator) {
      // this is for handling chain operation
      // user directly press next operator without press equal btn
      equalBtn.click();
    }

    currentOperator.operator = window[this.getAttribute("data-value")]; //turn the string of data-value to a function
    currentOperator.symbol = this.getAttribute("data-symbol");
    currentDigit = parseFloat(display.textContent);
    display.freeze = true;
  });
}

// handling equal button
equalBtn.addEventListener("click", () => {
  if (currentOperator.operator) {
    //not doing anything if there is no operator set up
    let result;
    try {
      result = operate(
        currentDigit,
        parseFloat(display.textContent),
        currentOperator.operator
      );
    } catch (error) {
      result = error;
    }
    displayShowResult(result);
    display.freeze = true;
    currentOperator = {};
  }
});

document.querySelector(".clearBtn").addEventListener("click", () => {
  displayClear();
  currentOperator = {};
  currentDigit = undefined;
});

// handling display
function displayAddDigit(digit) {
  if (display.freeze) {
    display.textContent = "";
    display.textContent = digit;
    display.freeze = false;
  } else {
    display.textContent += digit;
  }
}

function displayShowResult(num) {
  display.textContent = num;
}

function displayClear() {
  display.freeze = true;
  display.textContent = 0;
}

function displayToggleMinus() {
  if (display.textContent.charAt(0) === "-") {
    display.textContent = display.textContent.slice(1);
  } else {
    display.textContent = "-" + display.textContent;
  }
}

// functions of math operations
function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  if (num2 === 0) {
    throw "Error, Zero Division";
  }
  return num1 / num2;
}

// function for doing operation on two operand based on operator passed
function operate(num1, num2, operator) {
  let result = operator(num1, num2);
  console.log(`${num1} ${currentOperator.symbol} ${num2} = ${result}`);
  return result;
}
