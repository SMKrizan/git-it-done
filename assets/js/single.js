// creating reference to issue container
var issueContainerEl = document.querySelector("#issues-container");

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
            // pass response to DOM function
            displayIssues(data);
        });
        }
        else {
            alert("There was a problem with your request!");
        }
    });
};
getRepoIssues("smkrizan/Horiseon");

var displayIssues = function(issues) {
    // provide message to user if there are no issues to display
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for(i=0; i<issues.length; i++) {
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