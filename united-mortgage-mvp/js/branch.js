const profiles = {
  "jessica-carlin": {
    name: "Jessica Carlin",
    email: "jessica.carlin@unitedmtg.net",
    city: "Miami",
    state: "Florida"
  },
  "marina-moreno": {
    name: "Marina Moreno",
    email: "marina.moreno@unitedmtg.net",
    city: "Charlotte",
    state: "North Carolina"
  },
  "joell-pimentel": {
    name: "Joell Pimentel",
    email: "joell.pimentel@unitedmtg.net",
    city: "Charlotte",
    state: "North Carolina"
  },
  "talema-alvarado": {
    name: "Talema Alvarado",
    email: "talema.alvarado@unitedmtg.net",
    city: "Conway",
    state: "South Carolina"
  },
  "henry-burger": {
    name: "Henry Burger",
    email: "henry.burger@unitedmtg.net",
    city: "Mitchellville",
    state: "Maryland"
  },
  "dwight-williams": {
    name: "Dwight Williams",
    email: "dwight.williams@unitedmtg.net",
    city: "Tampa",
    state: "Florida"
  }
};

const params = new URLSearchParams(window.location.search);
const slug = params.get("branch");
const data = profiles[slug];

const container = document.getElementById("profile");

if (!data) {
  container.innerHTML = "<p>Profile not found</p>";
} else {
  container.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Location:</strong> ${data.city}, ${data.state}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
  `;
}
