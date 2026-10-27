const HOME_PRICE = 3.05;
let editIndex = -1;

document.addEventListener("DOMContentLoaded", init);

function init() {

    const dateField =
        document.getElementById("datum");

    dateField.value =
        new Date().toISOString().split("T")[0];

    document
        .getElementById("saveBtn")
        .addEventListener("click", saveCharge);

    registerServiceWorker();

    updateDashboard();
}

function saveCharge() {
    alert("saveCharge körs");

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

    let list =
        JSON.parse(localStorage.getItem("charges"))
        || [];

    list.push({
        date:
            document.getElementById("datum").value,
        place,
        kwh,
        cost,
        km:
            document.getElementById("km").value
    });
console. log(list);
alert (JSON.stringify(list));
    localStorage.setItem(
        "charges",
        JSON.stringify(list)
    );

    updateDashboard();

    alert("Laddning sparad");
}

function updateDashboard() {

    const dashboard =
        document.getElementById("dashboard");

    const data =
        JSON.parse(localStorage.getItem("charges"))
        || [];

    let totalCost = 0;
    let totalKwh = 0;

    data.forEach(item => {
        totalCost += item.cost;
        totalKwh += item.kwh;
    });

    dashboard.innerHTML = `
        <strong>Total kostnad:</strong>
        ${totalCost.toFixed(0)} kr<br>

        <strong>Total energi:</strong>
        ${totalKwh.toFixed(1)} kWh<br>

        <strong>Antal laddningar:</strong>
        ${data.length}
    `;
}

function registerServiceWorker() {

    if ("serviceWorker" in navigator) {

        navigator.serviceWorker
            .register("./service-worker.js")
            .catch(console.error);
    }
}

