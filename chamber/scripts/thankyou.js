
const params = new URLSearchParams(window.location.search);

function getParam(name) {
    return params.get(name) || "—";
}

function decodeValue(value) {
    if (value === "—") return value;
    return decodeURIComponent(value.replace(/\+/g, " "));
}

document.getElementById("out-firstname").textContent = decodeValue(getParam("firstname"));
document.getElementById("out-lastname").textContent = decodeValue(getParam("lastname"));
document.getElementById("out-email").textContent = decodeValue(getParam("email"));
document.getElementById("out-mobile").textContent = decodeValue(getParam("mobile"));
document.getElementById("out-orgname").textContent = decodeValue(getParam("orgname"));
document.getElementById("out-timestamp").textContent = decodeValue(getParam("timestamp"));


const levelMap = {
    np: "NP Membership — Non-Profit (Free)",
    bronze: "Bronze Membership",
    silver: "Silver Membership",
    gold: "Gold Membership"
};
const rawLevel = getParam("level");
document.getElementById("out-level").textContent = levelMap[rawLevel] || rawLevel;