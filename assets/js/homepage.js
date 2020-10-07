// GLOBAL VARIABLES
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
// call to the API every time 'topic' buttons are clicked
var languageButtonsEl = document.querySelector("#language-buttons");

// executed upon a form user-submission event
var formSubmitHandler = function (event) {
    // with form submission, the following expression prevents stops the browser from sending the form's input data to a URL so that input form data can instead be managed by this program
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    // send value to getUserRepos() or prompt entry
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

// executed upon a language button click event
var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    if (language) {
        getFeaturedRepos(language);

        //clear old content
        repoContainerEl.textContent = "";
    }
}

// HTTP request function to take in a language parameter and create API endpoint
var getFeaturedRepos = function(language) {
    var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            })
        } else {
            alert("Error: " + reponse.statusText);
        }
    });
}

// accepts HTTP response array of repo data and specified search term as parameters
var displayRepos = function (repos, searchTerm) {
    // check whether api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loops over repos
    for (var i = 0; i < repos.length; i++) {
        // formats repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // creates container for each repo and links to page to display issues
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // creates span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // appends span element to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check whether current repo has open issues and display accordingly
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append status check to container
        repoEl.appendChild(statusEl);

        // appends container to the dom
        repoContainerEl.appendChild(repoEl);
    };
};

// dynamic HTTP request to server
var getUserRepos = function (user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
        // if response code is in the 200s, the 'ok' property bundled in the response object will be 'true'. If false, the user will be alerted that there is a problem with their request.
        if (response.ok) {
            // callback to send to display function
            response.json().then(function (data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        // notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to GitHub");
    });
};

// EVENT LISTENERS
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);