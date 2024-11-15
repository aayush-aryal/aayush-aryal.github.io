'use strict';
const baseUrl = 'aayusharyal.pythonanywhere.com'; 

// Populate the selectors for language, category, and number
function populateSelectors(){
    const languages = {
        "cs": "CZECH",
        "de": "GERMAN",
        "en": "ENGLISH",
        "es": "SPANISH",
        "eu": "BASQUE",
        "fr": "FRENCH",
        "gl": "GALICIAN",
        "hu": "HUNGARIAN",
        "it": "ITALIAN",
        "lt": "LITHUANIAN",
        "pl": "POLISH",
        "sv": "SWEDISH"
    };

    const categories = ["all", "neutral", "chuck"];
    const languageSelect = document.getElementById("selLang");
    const categorySelect = document.getElementById("selCat");
    const numberSelect = document.getElementById("selNum");

    // Populate language options
    for (const [key, value] of Object.entries(languages)) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = value;
        languageSelect.appendChild(option);
    }

    // Populate category options
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });

    // Populate number of jokes (1-9)
    for (let i = 1; i <= 9; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        numberSelect.appendChild(option);
    }
    const option = document.createElement("option");
    option.value="all"
    option.textContent="all"
    numberSelect.appendChild(option);
};

// Populate the selectors on page load
populateSelectors();

const form = document.querySelector('form');
const jokeContainer = document.getElementById("jokes");  // Select the container where jokes will be displayed

// Handle the form submission
form.addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the form from refreshing the page
    
    const formData = new FormData(form);
    const language = formData.get('language');
    const category = formData.get('category');
    const number = formData.get('number');
    const jokeId = formData.get('jokeId') || null;  // Optional field for Joke ID

    try {
        let response;
        
        if (jokeId) {
            // Fetch specific joke by ID
            response = await fetch(`${baseUrl}/api/v1/jokes/${jokeId}`);
        } else if (number === "all") {
            // Fetch all jokes if "all" is selected
            response = await fetch(`${baseUrl}/api/v1/jokes/${language}/${category}`);
        } else {
            // Fetch specified number of jokes
            response = await fetch(`${baseUrl}/api/v1/jokes/${language}/${category}/${number}`);
        }

        console.log(response)

        // Check if the response is a 404 error
        if (response.status === 404) {
            const errorData = await response.json();
            console.log(errorData)
            // Display error message inside an article
            const article = document.createElement('article');
            article.classList.add('message', 'is-danger');
            article.innerHTML = `
                <div class="message-header"></div>
                <div class="message-body">${errorData.error}</div>
            `;
            jokeContainer.innerHTML = ''; // Clear any previous content
            jokeContainer.appendChild(article);
            return;  // Stop further processing if there's an error
        }


        const data = await response.json();
        console.log(data.jokes)
        // Clear previous jokes or errors
        jokeContainer.innerHTML = '';
            // Display each joke if no error
        data.jokes.forEach(joke => {
            const article = document.createElement('article');
            article.classList.add('message', 'is-info');
            article.innerHTML = `
                    <div class="message-header"></div>
                    <div class="message-body">${joke}</div>
                `;
            jokeContainer.appendChild(article);
            });
        
    } catch (error) {
        // Handle any errors during the fetch request
        console.log(error)
        jokeContainer.innerHTML = '';
        const article = document.createElement('article');
        article.classList.add('message', 'is-danger');
        article.innerHTML = `
            <div class="message-header"><p>Error</p></div>
            <div class="message-body">${error.message}</div>
        `;
        jokeContainer.appendChild(article);
    }
});
