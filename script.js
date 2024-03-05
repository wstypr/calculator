const display = document.querySelector("#display");
const info = document.querySelector("#info");
const equalBtn = document.querySelector("#equalBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const clearBtn = document.querySelector("#clearBtn");
let currentDigit;
let currentOperator = {};

// display state:
// display freeze: true = next numBtn pressed will replaced digit in display; :false = will be appended to digits in display
display.freeze = true;
// display allowFraction: true = periodBtn will append period/fraction; :false = disabled periodBtn
display.allowFraction = true;

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

// handling click on period button
const periodBtn = document.querySelector("#periodBtn");
periodBtn.addEventListener("click", () => {
  if (display.allowFraction) {
    if (display.freeze) {
      displayClear();
      displayAddDigit("0.");
    } else {
      displayAddDigit(".");
    }
    display.allowFraction = false;
  }
});

// handling click on operator number
for (const operatorBtn of document.querySelectorAll(".operatorBtn")) {
  operatorBtn.addEventListener("click", function () {
    if (currentOperator.operator) {
      // this is for handling chain operation
      // user directly press next operator without press equal btn
      equalBtn.click();
    }

    currentOperator.operator = window[this.getAttribute("name")]; //turn the string of name to a function
    currentOperator.symbol = this.getAttribute("data-symbol");
    currentDigit = parseFloat(display.textContent);
    display.freeze = true;
    display.allowFraction = true;
    updateInfo("operator");
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
    display.allowFraction = true;
    currentOperator = {};
  }
});

// handling delete button
deleteBtn.addEventListener("click", () => {
  displayDeleteDigit();
});

// handling all clear (AC) button
clearBtn.addEventListener("click", () => {
  displayClear();
  currentOperator = {};
  currentDigit = undefined;
  updateInfo();
});

// handling keyboard number input
window.addEventListener("keydown", (event) => {
  if ("1234567890+-*/".split("").includes(event.key)) {
    document.querySelector(`button[data-value='${event.key}'`).click();
  } else if (event.key === "Enter") {
    equalBtn.click();
  } else if (event.key === ".") {
    minusBtn.click();
  } else if (event.key === "Backspace") {
    deleteBtn.click();
  } else if (event.key === "Delete") {
    clearBtn.click();
  }
});

// handling display
function displayAddDigit(digit) {
  if (display.freeze) {
    display.textContent = "";
    display.textContent = digit;
    display.freeze = false;
  } else if (display.textContent === "0") {
    display.textContent = digit;
  } else {
    display.textContent += digit;
  }
}

function displayDeleteDigit() {
  if (display.freeze) {
    display.textContent = 0;
  } else {
    display.textContent = display.textContent.slice(0, -1);
    if (display.textContent.length === 0) {
      display.textContent = 0;
    }
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

  if (currentDigit && display.freeze) {
    // when the minus button pressed after an operator being pressed but the next number is not yet pressed
    currentDigit *= -1;
  }
}

function updateInfo(state) {
  switch (state) {
    case "operator":
      info.textContent = `${currentDigit} ${currentOperator.symbol}`;
      break;
    case "equal":
      info.textContent = `${currentDigit} ${currentOperator.symbol} ${display.textContent}`;
      break;
    default:
      info.textContent = "";
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
  return (num1 * 10 ** 15) / (num2 * 10 ** 15);
}

// function for doing operation on two operand based on operator passed
function operate(num1, num2, operator) {
  let result = operator(num1, num2);
  if (result.toString().length >= 15) {
    result = result.toExponential(8);
  }

  let history = document.createElement("div");
  history.textContent = `${num1} ${currentOperator.symbol} ${num2} = ${result}`;
  history.className = "history";
  history.addEventListener("click", function () {
    clearBtn.click();
    displayShowResult(result);
  });
  document.querySelector(".history-container").prepend(history);

  updateInfo("equal");
  return result;
}
