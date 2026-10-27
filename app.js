const HOME_PRICE = 3.05;
let editIndex = -1;

document.addEventListener("DOMContentLoaded", init);

function init() {

    document
    .getElementById("exportCsvBtn")
    .addEventListener(
        "click",
        exportCsv
    );
    const dateField =
        document.getElementById("datum");

    dateField.value =
        new Date().toISOString().split("T")[0];

    document
        .getElementById("saveBtn")
        .addEventListener("click", saveCharge);

    registerServiceWorker();

    updateDashboard();
    renderHistory();
}

function saveCharge() {

    const place =
        document.getElementById("plats").value;

    const kwh =
        parseFloat(
            document.getElementById("kwh").value
        ) || 0;

    let cost =
        parseFloat(
            document.getElementById("kostnad").value
        ) || 0;

    if (place === "Hemma") {
        cost = kwh * HOME_PRICE;
    }

    const charge = {

        date:
            document.getElementById("datum").value,

        place,

        kwh,

        cost,

        km:
            parseInt(
                document.getElementById("km").value
            ) || 0
    };

    let list =
        JSON.parse(
            localStorage.getItem("charges")
        ) || [];

    if (editIndex >= 0) {

        list[editIndex] = charge;

        editIndex = -1;

        document.getElementById(
            "saveBtn"
        ).textContent = "Spara laddning";

    } else {

        list.push(charge);

    }

    localStorage.setItem(
        "charges",
        JSON.stringify(list)
    );

    clearForm();
    updateDashboard();
    renderHistory();
}
function updateDashboard() {

    const dashboard =
        document.getElementById("dashboard");

    const data =
        JSON.parse(localStorage.getItem("charges"))
        || [];

    let totalCost = 0;
    let totalKwh = 0;
let costPerMil = 0;

if (data.length >= 2) {

    const firstKm = data[0].km;
    const lastKm = data[data.length - 1].km;

    const distanceMil =
        (lastKm - firstKm) / 10;

    if (distanceMil > 0) {

        costPerMil =
            totalCost / distanceMil;
    }
}
    data.forEach(item => {
        totalCost += item.cost;
        totalKwh += item.kwh;
    });

    dashboard.innerHTML = `
        dashboard.innerHTML = `
    <strong>Total kostnad:</strong>
    ${totalCost.toFixed(0)} kr<br>

    <strong>Total energi:</strong>
    ${totalKwh.toFixed(1)} kWh<br>

    <strong>Antal laddningar:</strong>
    ${data.length}<br>

    <strong>Snittpris:</strong>
    ${(totalCost / Math.max(totalKwh,1)).toFixed(2)}
    kr/kWh<br>

    <strong>Kostnad per mil:</strong>
    ${costPerMil.toFixed(2)}
    kr/mil
`;
    `;
}

function registerServiceWorker() {

    if ("serviceWorker" in navigator) {

        navigator.serviceWorker
            .register("./service-worker.js")
            .catch(console.error);
    }
}
function clearForm() {

    document.getElementById("kwh").value = "";
    document.getElementById("kostnad").value = "";
    document.getElementById("km").value = "";
}

function renderHistory() {

    const container =
        document.getElementById(
            "historyContainer"
        );

    const data =
        JSON.parse(
            localStorage.getItem("charges")
        ) || [];

    if (data.length === 0) {

        container.innerHTML =
            "Inga laddningar registrerade.";

        return;
    }

    let html = `
    <table style="width:100%">
    <tr>
        <th>Datum</th>
        <th>Plats</th>
        <th>kWh</th>
        <th>Kr</th>
        <th></th>
    </tr>
    `;

    data.forEach((item,index) => {

        html += `
        <tr>

        <td>${item.date}</td>

        <td>${item.place}</td>

        <td>${item.kwh}</td>

        <td>${item.cost.toFixed(0)}</td>

        <td>
        <button onclick="editCharge(${index})">
        ✏️
        </button>

        <button onclick="deleteCharge(${index})">
        🗑️
        </button>
        </td>

        </tr>
        `;
    });

    html += "</table>";

    container.innerHTML = html;
}
function editCharge(index) {

    const data =
        JSON.parse(
            localStorage.getItem("charges")
        ) || [];

    const item = data[index];

    if (!item) {
        return;
    }

    document.getElementById("datum").value =
        item.date;

    document.getElementById("plats").value =
        item.place;

    document.getElementById("kwh").value =
        item.kwh;

    document.getElementById("kostnad").value =
        item.cost;

    document.getElementById("km").value =
        item.km;

    editIndex = index;

    document.getElementById("saveBtn")
        .textContent = "Spara ändringar";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function deleteCharge(index) {

    if (!confirm(
        "Vill du verkligen radera denna laddning?"
    )) {
        return;
    }

    let data =
        JSON.parse(
            localStorage.getItem("charges")
        ) || [];

    data.splice(index, 1);

    localStorage.setItem(
        "charges",
        JSON.stringify(data)
    );

    updateDashboard();
    renderHistory();
}
function exportCsv() {

    const data =
        JSON.parse(
            localStorage.getItem("charges")
        ) || [];

    let csv =
        "Datum,Plats,kWh,Kostnad,KM\n";

    data.forEach(item => {

        csv +=
            `${item.date},${item.place},${item.kwh},${item.cost},${item.km}\n`;

    });

    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "Polestar4_Laddningar.csv";

    link.click();
}
