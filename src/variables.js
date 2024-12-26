const STARTING_BALANCE = Number(localStorage.getItem("starting_balance") || 0)
const STARTING_SAVINGS = Number(localStorage.getItem("starting_savings") || 0)
const MONTHS_TO_RENDER = Number(localStorage.getItem("months_to_render") || 13)
const STARTING_MONTH = new Date(2024, 11, 1)

const SALARY = new Array(MONTHS_TO_RENDER).fill(0)
const MONTHLY_EXPENSES = new Array(MONTHS_TO_RENDER).fill(0)
const LOAN_PAYMENTS = new Array(MONTHS_TO_RENDER).fill(0)
const ITEMS_TO_BE_BOUGHT = new Array(MONTHS_TO_RENDER).fill(0)
const OTHER_EXPENSES = new Array(MONTHS_TO_RENDER).fill(0)
const HEALTH_EXPENSES = new Array(MONTHS_TO_RENDER).fill(0)
const SAVINGS = new Array(MONTHS_TO_RENDER).fill(0)
const UNPLANNED_EXPENSES = new Array(MONTHS_TO_RENDER).fill(0)

let months_available = 0

const MONTHS = []
const TOTAL_EXPENSES_EACH_MONTH = []
const MONTHLY_BALANCES = []