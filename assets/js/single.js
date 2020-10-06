// GLOBAL VARIABLES to REFERENCE the DOM
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

// this function fetches related issues from GitHub API issues endpoint
var getRepoName = function() {
    // extract repo name from query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    // checking for valid repoName value before passing to respective function
    if(repoName) {
        // use newly extracted 'repoName' to update element's text content
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        // redirect to homepage
        document.location.replace("./index.html");
    }
};

var displayWarning = function (repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit this repository on ";
    
    // append a link element with href pointing to the repo on github
    var linkEl = document.createElement("a");
    linkEl.textContent = "GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    
    // append link to warning container
    limitWarningEl.appendChild(linkEl);
};

var displayIssues = function (issues) {
    // provide message to user if there are no issues to display
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (i = 0; i < issues.length; i++) {
        // create link element(s) to take users to the github issue(s)
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        
        // create span to hold issue[i] title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        
        // append to container
        issueEl.appendChild(titleEl);
        
        // create type element
        var typeEl = document.createElement("span");
        
        //check whether issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textConten = "(Issue)";
        }
        
        // append to container
        issueEl.appendChild(typeEl);
        
        // append <a> element to the page
        issueContainerEl.appendChild(issueEl);
    }
};

var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    // make a get request
    fetch(apiUrl).then(function (response) {
        // request was successful
        if (response.ok) {
            response.json().then(function (data) {
                // pass response to DOM function
                displayIssues(data);
                // check whether repo has more than 30 issues and if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            // redirect to homepage
            document.location.replace("./index.html");
        }
    });
}

getRepoName()