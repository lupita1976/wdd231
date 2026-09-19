const spotlightsEl = document.getElementById("spotlights");

const spotlightLabels = {
  2: "Silver",
  3: "Gold",
};

async function getSpotlightMembers() {
  const response = await fetch("data/members.json");
  const data = await response.json();
  displaySpotlights(data.members);
}

const displaySpotlights = (members) => {
 
  const eligible = members.filter(
    (member) => member.membershipLevel === 2 || member.membershipLevel === 3
  );

  
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  const howMany = Math.random() < 0.5 ? 2 : 3;
  const selected = shuffled.slice(0, howMany);

  spotlightsEl.innerHTML = "";

  selected.forEach((member) => {
    const card = document.createElement("div");
    card.className = "spotlight-card";

    const logo = document.createElement("img");
    logo.setAttribute("src", `images/${member.imageFile}`);
    logo.setAttribute("alt", `Logo de ${member.companyName}`);
    logo.setAttribute("loading", "lazy");
    logo.setAttribute("width", "90");
    logo.setAttribute("height", "90");

    const badge = document.createElement("span");
    badge.className = `badge badge-${member.membershipLevel}`;
    badge.textContent = `${spotlightLabels[member.membershipLevel]} Member`;

    const name = document.createElement("h3");
    name.textContent = member.companyName;

    const phone = document.createElement("p");
    phone.textContent = member.phoneNumber;

    const address = document.createElement("p");
    address.textContent = member.address;

    const website = document.createElement("p");
    const websiteLink = document.createElement("a");
    websiteLink.setAttribute("href", member.websiteURL);
    websiteLink.setAttribute("target", "_blank");
    websiteLink.setAttribute("rel", "noopener");
    websiteLink.textContent = "Visitar sitio web";
    website.appendChild(websiteLink);

    card.appendChild(logo);
    card.appendChild(badge);
    card.appendChild(name);
    card.appendChild(phone);
    card.appendChild(address);
    card.appendChild(website);

    spotlightsEl.appendChild(card);
  });
};

getSpotlightMembers();
