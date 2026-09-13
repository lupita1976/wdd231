
const hamburger = document.getElementById("hamburger");
const primaryNav = document.getElementById("primary-nav");

hamburger.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});


document.getElementById("lastModified").textContent =
  `Last Modification: ${document.lastModified}`;


const url = "data/members.json";
const directory = document.getElementById("directory");
const memberCount = document.getElementById("member-count");
const gridBtn = document.getElementById("grid-btn");
const listBtn = document.getElementById("list-btn");

const membershipLabels = {
  1: "Non-Profit",
  2: "Silver",
  3: "Gold",
};

async function getMemberData() {
  const response = await fetch(url);
  const data = await response.json();
  displayMembers(data.members);
}

const displayMembers = (members) => {
  memberCount.textContent = `${members.length} Companys in the chamber`;

  members.forEach((member) => {
    const card = document.createElement("div");
    card.className = "member-card";

    const logo = document.createElement("img");
    logo.setAttribute("src", `images/${member.imageFile}`);
    logo.setAttribute("alt", `Logo de ${member.companyName}`);
    logo.setAttribute("loading", "lazy");
    logo.setAttribute("width", "160");
    logo.setAttribute("height", "160");

    const body = document.createElement("div");
    body.className = "card-body";

    const badge = document.createElement("span");
    badge.className = `badge badge-${member.membershipLevel}`;
    badge.textContent = membershipLabels[member.membershipLevel];

    const name = document.createElement("h2");
    name.textContent = member.companyName;

    const industry = document.createElement("p");
    industry.textContent = member.industry;

    const address = document.createElement("p");
    address.textContent = member.address;

    const phone = document.createElement("p");
    phone.textContent = member.phoneNumber;

    const website = document.createElement("p");
    const websiteLink = document.createElement("a");
    websiteLink.setAttribute("href", member.websiteURL);
    websiteLink.setAttribute("target", "_blank");
    websiteLink.setAttribute("rel", "noopener");
    websiteLink.textContent = "Open page web";
    website.appendChild(websiteLink);

    body.appendChild(badge);
    body.appendChild(name);
    body.appendChild(industry);
    body.appendChild(address);
    body.appendChild(phone);
    body.appendChild(website);

    card.appendChild(logo);
    card.appendChild(body);

    directory.appendChild(card);
  });
};

getMemberData();

gridBtn.addEventListener("click", () => {
  directory.classList.remove("list-view");
  directory.classList.add("grid-view");
  gridBtn.classList.add("active");
  gridBtn.setAttribute("aria-pressed", "true");
  listBtn.classList.remove("active");
  listBtn.setAttribute("aria-pressed", "false");
});

listBtn.addEventListener("click", () => {
  directory.classList.remove("grid-view");
  directory.classList.add("list-view");
  listBtn.classList.add("active");
  listBtn.setAttribute("aria-pressed", "true");
  gridBtn.classList.remove("active");
  gridBtn.setAttribute("aria-pressed", "false");
});
