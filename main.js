const nav_bar_search = document.getElementById("search");
const searched_element = document.getElementById("search-input");

const clear = document.getElementById("clear");

const results_container = document.getElementById("results");
const results_sub = document.getElementById("results-container");

const time_view = document.getElementById("time-view");

let results;

function clean_view() {
  hide_results();
  clear_results();
}

clear.addEventListener("click", (event) => {
  event.preventDefault();
  searched_element.value = "";
  clean_view();
});

nav_bar_search.addEventListener("submit", async (event) => {
  event.preventDefault();

  clear_results();

  const searched = searched_element.value;
  const processed = searched.trim().toLowerCase();

  if (!processed.trim()) return clean_view();

  try {
    const data = await fetch("./data.json");
    const json = await data.json();

    if (["beach", "beaches"].includes(processed)) {
      results = json.beaches ?? [];
    } else if (["temple", "temples"].includes(processed)) {
      results = json.temples ?? [];
    } else if (["country", "countries", "city", "cities"].includes(processed)) {
      results = json.countries.flatMap((item) => item.cities) ?? [];
    } else {
      const to_search = json.countries.find((country) => {
        if (country.name.toLowerCase() === processed) return country;
      });
      results = to_search ? to_search.cities : [];
      if (to_search) {
        const timeZones = {
          brazil: "America/Sao_Paulo",
          japan: "Asia/Tokyo",
          australia: "Australia/Sydney",
        };

        const selected = timeZones[processed];
        if (!selected) return;

        const options = {
          timeZone: selected,
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };
        const time = new Date().toLocaleTimeString("en-US", options);
        time_view.innerHTML = `Current time in ${selected}: ${time}`;
      }
    }
    show_results(results);
  } catch (e) {
    console.log(e);
    alert("An error just occured");
  }
});

function show_empty() {
  const container = document.createElement("div");
  const body = document.createElement("p");

  body.innerHTML = "No Results";
  container.classList.add("no-results");
  container.id = "empty";
  container.appendChild(body);
  results_sub.appendChild(container);
}

function show_results(result) {
  results_container.style.display = "flex";
  const items = generate_results(result);
  items.forEach((item) => results_sub.appendChild(item));
  if (result.length < 1) {
    show_empty();
  }
}

function hide_results() {
  results_container.style.display = "none";
}

function clear_results() {
  results_sub.innerHTML = "";
  results = [];
}

function generate_results(data) {
  return data.map((item) => {
    const container = document.createElement("div");
    const img = document.createElement("img");
    const sub_container = document.createElement("div");
    const title = document.createElement("h1");
    const body = document.createElement("p");
    const link = document.createElement("a");

    container.classList.add("result-item");
    img.classList.add("result-img");
    sub_container.classList.add("result-sub");
    title.classList.add("result-title");
    body.classList.add("result-body");
    link.classList.add("result-link");

    img.src = item.imageUrl ?? "";
    title.innerHTML = item.name ?? "";
    body.innerHTML = item.description ?? "";
    link.href = "./";
    link.innerHTML = "Visit";

    sub_container.appendChild(title);
    sub_container.appendChild(body);
    sub_container.appendChild(link);

    container.appendChild(img);
    container.appendChild(sub_container);
    return container;
  });
}
