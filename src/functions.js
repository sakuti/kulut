const ALL_VARIABLES = [
  SALARY,
  MONTHLY_EXPENSES,
  LOAN_PAYMENTS,
  ITEMS_TO_BE_BOUGHT,
  OTHER_EXPENSES,
  HEALTH_EXPENSES,
  SAVINGS,
  UNPLANNED_EXPENSES
]

const EXPENSES = [
  MONTHLY_EXPENSES,
  LOAN_PAYMENTS,
  ITEMS_TO_BE_BOUGHT,
  OTHER_EXPENSES,
  HEALTH_EXPENSES,
  SAVINGS,
  UNPLANNED_EXPENSES
]

const TABLE_HEADERS = {
  "Saldo kulujen jälkeen": MONTHLY_BALANCES,
  "Tulot": SALARY,
  "Kuukausikulut": MONTHLY_EXPENSES,
  "Lainat": LOAN_PAYMENTS,
  "Hankinnat": ITEMS_TO_BE_BOUGHT,
  "Terveys": HEALTH_EXPENSES,
  "Säästöt": SAVINGS,
  "Muut": OTHER_EXPENSES,
  "Suunnittelemattomat": UNPLANNED_EXPENSES
}


function fillMonthDates() {
  const date = new Date(STARTING_MONTH)

  for (let i = 0; i <= months_available; i++) {
    MONTHS.push(new Date(date))
    date.setMonth(date.getMonth() + 1);
  }
}


function calculateMonthlyBalance() {
  MONTHLY_BALANCES.length = 0
  TOTAL_EXPENSES_EACH_MONTH.length = 0

  const balance_after_each_month = []
  const expenses_each_month = EXPENSES.reduce((prev, curr) => {
    return prev.map((v, i) => v + curr[i])
  })

  for (let i = 0; i < months_available; i++) {
    balance_after_each_month.push(
      i !== 0
        ? (balance_after_each_month[i - 1] + SALARY[i] + expenses_each_month[i])
        : (expenses_each_month[i] + SALARY[i] + STARTING_BALANCE)
    )
  }

  TOTAL_EXPENSES_EACH_MONTH.push(...expenses_each_month)
  MONTHLY_BALANCES.push(...balance_after_each_month)
}


function validateStoredValues() {
  const salary_length = SALARY.length
  months_available = salary_length;

  return ALL_VARIABLES.every(variable => {
    return variable.length === salary_length
  })
}

function saveNewValue(monthId, headerId, newValue) {
  if (isNaN(newValue) || newValue.length === 0) {
    localStorage.setItem(
      "override",
      JSON.stringify(
        JSON.parse(localStorage.getItem("override") || "[]").filter(val => {
          return !(val.month === monthId && val.header === headerId)
        })
      )
    )

    return window.location.reload()
  }

  localStorage.setItem("override", JSON.stringify([
    ...(JSON.parse(localStorage.getItem("override") || "[]")),
    { month: monthId, header: headerId, value: Number(newValue) }
  ]))
}

function overrideStoredValues() {
  const values = JSON.parse(localStorage.getItem("override") || "[]")

  values.map(entry => {
    TABLE_HEADERS[entry.header][entry.month] = entry.value
  })
}

// From stackoverflow
function download(file, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', file);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// From stackoverflow
function getFile(event) {
  event.preventDefault()

  const input = event.target

  if ('files' in input && input.files.length > 0) {
    loadSave(input.files[0]).then(data => {
      const json = JSON.parse(atob(data))
      localStorage.setItem("override", JSON.stringify(json.override))
      localStorage.setItem("starting_balance", Number(json.starting_balance))
      localStorage.setItem("months_to_render", Number(json.months_to_render))
      window.location.reload()
    })
  }
}

// From stackoverflow
function loadSave(savefile) {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(savefile)
  })
}