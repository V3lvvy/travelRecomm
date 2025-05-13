document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const clearBtn = document.getElementById("clear-btn");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results");
  
    searchBtn.addEventListener("click", async () => {
        const query = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = ""; // Clear old results
  
        try {
            const res = await fetch("travel_recommendation_api.json");
            const data = await res.json();
  
            let matches = [];
  
            // Handle specific keywords
            if (["beach", "beaches"].includes(query)) {
                matches = data.beaches;
            } else if (["temple", "temples"].includes(query)) {
                matches = data.temples;
            } else {
                // Search in countries and cities
                data.countries.forEach(country => {
                    const countryMatch = country.name.toLowerCase().includes(query);
                    const cityMatches = country.cities.filter(city =>
                        city.name.toLowerCase().includes(query)
                    );
                    if (countryMatch || cityMatches.length > 0) {
                        matches.push(...cityMatches);
                    }
                });

                // Search in beaches and temples too
                data.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(query)) matches.push(beach);
                });

                data.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(query)) matches.push(temple);
                });
            }
  
            if (matches.length === 0) {
                resultsContainer.innerHTML = "<p class='text-white font-semibold'>No matches found.</p>";
            } else {
                let resultsHTML = ""; // Create HTML string for results
                matches.forEach(item => {
                    resultsHTML += `
                        <div class="bg-black/50 p-4 rounded-lg shadow-md hover:bg-black/70 transition">
                            <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-40 object-cover rounded-md mb-3" />
                            <h3 class="text-lg font-bold mb-1">${item.name}</h3>
                            <p class="text-sm">${item.description}</p>
                        </div>
                    `;
                });
                resultsContainer.innerHTML = resultsHTML; // Set all results at once
            }
  
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });
  
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        resultsContainer.innerHTML = "";
    });
});
