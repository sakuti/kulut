function render() {
  const table = document.querySelector("table>tbody")
  table.innerHTML = ""

  // Render headers
  table.innerHTML += `<tr>
    <th>Kuukausi</th>
    ${Object.keys(TABLE_HEADERS).map(key => `<th>${key}</th>`).join("")}
  </tr>`;

  // Render values
  for (let i = 0; i < months_available; i++) {
    const month = MONTHS[i].toLocaleDateString("fi-FI", {
      month: "long",
      year: "numeric"
    })

    const values = Object.keys(TABLE_HEADERS).map(key => {
      return `
        <td
          data-month="${i}"
          data-value="${key}"
          data-negative="${TABLE_HEADERS[key][i] < 0}"
          data-zero="${TABLE_HEADERS[key][i] === 0}"
        >
          ${TABLE_HEADERS[key][i].toFixed(2)} €
        </td>
      `
    }).join("")

    table.innerHTML += `<tr><td>${month}</td> ${values}</tr>`;
  }

  addEventListeners()
}

function renderSettings() {
  const settings = {
    "starting-balance": document.querySelector('td[setting-starting-balance]'),
    "months-to-render": document.querySelector('td[setting-months-to-render]'),
    "save-data": document.querySelector('td[setting-save-data]'),
    "load-data": document.querySelector('td[setting-load-data]'),
    "destroy-data": document.querySelector('td[setting-destroy-data]')
  }

  // Starting balance setting
  settings["starting-balance"].textContent = `${STARTING_BALANCE.toFixed(2)} €`
  settings["starting-balance"].addEventListener("click", () => {
    const newValue = prompt("Anna uusi aloitussaldo")
    if (isNaN(newValue)) return

    localStorage.setItem("starting_balance", Number(newValue))
    window.location.reload()
  })

  // Months to render
  settings["months-to-render"].textContent = `${MONTHS_TO_RENDER}`
  settings["months-to-render"].addEventListener("click", () => {
    const newValue = prompt("Anna uusi kuukausien lukumäärä")
    if (isNaN(newValue)) return

    localStorage.setItem("months_to_render", Number(newValue))
    window.location.reload()
  })

  // Save data
  settings["save-data"].addEventListener("click", () => {
    const data = btoa(JSON.stringify({
      override: JSON.parse(localStorage.getItem("override") || "[]"),
      starting_balance: STARTING_BALANCE,
      months_to_render: MONTHS_TO_RENDER
    }))

    download(`data_download_${new Date().toISOString()}.txt`, data)
  })

  // Load data
  settings["load-data"].querySelector("input").addEventListener('change', getFile)

  // Destroy data
  settings["destroy-data"].addEventListener("click", () => {
    if (confirm("Oletko varma, että haluat poistaa kaiken datan?")) {
      localStorage.removeItem("override")
      localStorage.removeItem("starting_balance")
      localStorage.removeItem("months_to_render")
      window.location.reload()
    }
  })
}

function addEventListeners() {
  const data_elements = document.querySelectorAll('td[data-month]:not([data-value="Saldo kulujen jälkeen"])')

  data_elements.forEach(elem => {
    elem.addEventListener("click", () => {
      saveNewValue(
        elem.getAttribute("data-month"),
        elem.getAttribute("data-value"),
        prompt("Anna uusi arvo")
      )

      overrideStoredValues()
      calculateMonthlyBalance()
      render()
    })
  })
}

if (validateStoredValues()) {
  fillMonthDates()
  overrideStoredValues()
  calculateMonthlyBalance()
  render()
  renderSettings()
} else {
  alert("Invalid variable store")
}