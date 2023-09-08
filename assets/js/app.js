import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { FIREBASE_CONFIG, GITHUB_CONFIG } from "../../config.js";

import {
  getAuth,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
const app = initializeApp(FIREBASE_CONFIG);
const provider = new GoogleAuthProvider();
const auth = getAuth();

let userDetails = null;
let profile = document.getElementById("profile");
export const renderUserDetails = () => {
  if (!userDetails) {
    return null;
  }
  const headerUserName = document.getElementById("userName");
  const headerUserPic = document.getElementById("userPic");

  headerUserName.innerText = "Hi, " + userDetails.displayName;
  headerUserPic.src = userDetails.photoURL;
};

export const validateUserDetails = () => {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "./login.html";
      return;
    }
    userDetails = user;
    renderUserDetails();
    // Extract data from session
  });
};

export const onLogOutUser = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.href = "./login.html";
    })
    .catch((error) => {
      // An error happened.
      alert("error in logging out");
    });
};

//search input
const searchUser = document.querySelector("#searchUser");

//search input event
searchUser.addEventListener("keyup", (e) => {
  //get input text
  const userText = e.target.value;

  if (userText !== "") {
    //Make HTTPS Call
    getGithubUserInfo(userText).then((data) => {
      console.log(userText, data);
      if (!data || data.profile.message.includes("API rate limit exceeded")) {
        //Show Alert
        showAlert("User not found");
        clearProfile();
      } else {
        //Show profile
        showProfile(data.profile);
        //show repos
        showRepos(data.repos);
      }
    });
  } else {
    //clear profile
    clearProfile();
  }
});

//fetch Github Details
async function getGithubUserInfo(user) {
  const profileResponse = await fetch(
    `https://api.github.com/users/${user}?client_id=${GITHUB_CONFIG.MY_API_TOKEN}&client_secret=${GITHUB_CONFIG.SECRET_API_KEY}`
  );

  const reposResponse = await fetch(
    `https://api.github.com/users/${user}/repos?per_page=5&sort=asc&client_id=${GITHUB_CONFIG.MY_API_TOKEN}&client_secret=${GITHUB_CONFIG.SECRET_API_KEY}`
  );

  const profile = await profileResponse.json();
  const repos = await reposResponse.json();

  return {
    profile,
    repos,
  };
}

//Rendering User's Github Info
function showProfile(user) {
  profile.innerHTML = `
  <div class = "github-card">
    <div class = "user-github-card">
        <div class = "user-github-info">
          <img class = "user-avatar" src = "${user.avatar_url}">
          <a href = "${user.html_url}" target = "_blank" class = "btn btn-primary" ><i class="fa-brands fa-github"></i> View Profile</a>
        </div>
        <div class = "user-github-details">
          <span class = "btn btn-primary"> Public Repos: ${user.public_repos}</span>
          <span class = "btn btn-warning"> Public Gists: ${user.public_gists}</span>
          <span class = "btn btn-success"> Followers: ${user.followers}</span>
          <span class = "btn btn-info"> Following: ${user.following}</span>
          <br><br>
          <ul class = "list-group">
          <li class = "list-group-item">Company: ${user.company}</li>
          <li class = "list-group-item">Website/Blog: ${user.blog}</li>
          <li class = "list-group-item">Location: ${user.location}</li>
          <li class = "list-group-item">Member since: ${user.created_at}</li>
          </ul>
        </div>
    </div>
  </div>
  <h3 class = "page-heading"> Latest Repos</h3>
  <div id = "repos"></div>
  `;
}

//show user repos
function showRepos(repos) {
  let output = "";

  repos.forEach((repo) => {
    output += `
    <div class = "user-github-repo">
      <div class = "user-github-repo-info">
        <div class = "user-github-repo-name">
          <a href = "${repo.html_url}" target = "_blank">${repo.name}</a>
        </div>
        <div class = "user-github-repo-badge">
          <span class = "badge bg-primary"> Stars: ${repo.stargazers_count}</span>
          <span class = "badge bg-warning"> Watchers: ${repo.watchers_count}</span>
          <span class = "badge bg-success"> Forks: ${repo.forms_count}</span>
        </div>
      </div>
    </div>
    `;
  });

  //output repos
  document.getElementById("repos").innerHTML = output;
}

//show alert for profile not found
function showAlert(message) {
  //clear any remaining alert
  clearAlert();
  //creat div
  const div = document.createElement("div");

  //add classes
  div.className = "alert-message";

  //add text
  div.appendChild(document.createTextNode(message));

  //get parent
  const container = document.querySelector(".search-card");

  console.log("container", container);

  //get search box
  const search = document.querySelector(".search");

  //insert alert
  container.insertBefore(div, search);

  //remove alert after three seconds
  setTimeout(() => {
    this.clearAlert();
  }, 2000);
}

//clear alert message
function clearAlert() {
  const currentAlert = document.querySelector(".alert-message");

  if (currentAlert) {
    currentAlert.remove();
  }
}

//clear profile
function clearProfile() {
  this.profile.innerHTML = ``;
}
