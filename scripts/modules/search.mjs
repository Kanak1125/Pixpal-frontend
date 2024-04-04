const SEARCH_BASE_URL = '/pages/results.html?query=';
const searchForm = document.getElementById('search-form');
const searchFormInput = document.getElementById('search-form-input');
const searchBarInfoContainer = document.querySelector('.search-bar-info-container');
const recentSearchList = document.querySelector('.recent-searches-list');
const clearRecentSearchesBtn = document.querySelector('.clear-recent-searches-btn');

const MAX_RECENT_SEARCHES_LEN = 8;
let recentSearches = JSON.parse(localStorage.getItem("recent-searches")) || [];

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchQuery = searchFormInput.value.trim();

    if (recentSearches.length >= MAX_RECENT_SEARCHES_LEN) {
        recentSearches.pop();
        recentSearches.unshift(searchQuery);
    } else {
        recentSearches.unshift(searchQuery);
    }

    localStorage.setItem("recent-searches", JSON.stringify(recentSearches));

    const url = `${SEARCH_BASE_URL}${encodeURIComponent(searchQuery)}`;
    window.location.href = url;
});

clearRecentSearchesBtn.addEventListener('click', () => {
    localStorage.clear('recent-searches');
    recentSearches = [];
    recentSearchList.innerHTML = "";
});

searchFormInput.addEventListener('focus', () => {
    searchBarInfoContainer.classList.add('active');
});

recentSearchList.innerHTML = "";
for (let item of recentSearches) {
    addRecentSearchesToDOM(item);
}

document.addEventListener('click', (e) => {
  let clickInside = searchBarInfoContainer.contains(e.target) || e.target == searchFormInput;

  if (!clickInside) {
     searchBarInfoContainer.classList.remove('active');
  }
});

function addRecentSearchesToDOM(item) {
    const recentSearchTag = document.createElement('a');
    recentSearchTag.classList.add('recent-search-tag');
    recentSearchTag.textContent = item;
    recentSearchTag.href = `${SEARCH_BASE_URL}${item}`;
    recentSearchList.appendChild(recentSearchTag);
}