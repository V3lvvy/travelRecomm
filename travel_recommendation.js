document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const clearBtn = document.getElementById("clear-btn");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results");

    searchBtn.addEventListener("click", async () => {
        const query = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = ""; // Clear old results
        resultsContainer.classList.remove('hidden'); // Show the results container

        try {
            const res = await fetch("travel_recommendation_api.json");
            const data = await res.json();

            let matches = [];

            // Check if the query matches one of the specific categories (beach, temple, country)
            if (["beach", "beaches"].includes(query)) {
                matches = data.beaches;
            } else if (["temple", "temples"].includes(query)) {
                matches = data.temples;
            } else if (["country", "countries"].includes(query)) {
                matches = data.countries;
            }

            // If no matches are found for the query
            if (matches.length === 0) {
                resultsContainer.innerHTML = "<p class='text-black font-semibold p-4'>No matches found.</p>";
            } else {
                // Generate HTML content for the results
                let resultsHTML = "";
                matches.slice(0, 2).forEach(item => { // Limit to the first 2 results
                    resultsHTML += `
                        <div class="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition">
                            <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-40 object-cover rounded-md mb-3" />
                            <h3 class="text-lg font-bold mb-1">${item.name}</h3>
                            <p class="text-sm">${item.description}</p>
                        </div>
                    `;
                });
                resultsContainer.innerHTML = resultsHTML; // Insert the results
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            resultsContainer.innerHTML = "<p class='text-black font-semibold p-4'>An error occurred while fetching data.</p>";
        }
    });

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        resultsContainer.innerHTML = "";
        resultsContainer.classList.add('hidden'); // Hide the results when cleared
    });
});
