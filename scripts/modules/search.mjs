const SEARCH_BASE_URL = '/pages/results.html?query=';
const searchForm = document.getElementById('search-form');
const searchFormInput = document.getElementById('search-form-input');
const searchBarInfoContainer = document.querySelector('.search-bar-info-container');
const recentSearchList = document.querySelector('.recent-searches-list');
const clearRecentSearchesBtn = document.querySelector('.clear-recent-searches-btn');

const searchBarRecommendationInfoContainer = document.querySelector('.search-bar-recommendation-info-container');
const recommendedSearchList = document.querySelector('.recommended-searches-list');

const MAX_RECENT_SEARCHES_LEN = 8;
const MAX_RECOMMENDED_SEARCHES_LEN = 6;

let recentSearches = JSON.parse(localStorage.getItem("recent-searches")) || [];

// the following keywords will be the set of all the tags from the database...
// const keywords = ['space', 'alien', 'mountain', 'hill', 'hike', 'nature', 'nocturnal', 'bike', 'car', 'animal', 'pet', 'bird', 'fish', 'dinosaurs', 'plant', 'flower', 'star', 'sun', 'moon', 'jupiter', 'venus', 'mercury', 'planet', 'mars', 'saturn', 'pluto', 'uranus', 'neptune', 'station', 'ceres', 'dwarf', 'city', 'countryside', 'Nepal', 'Japan', 'Switzerland', 'Norway', 'Canada', 'Tokyo', 'Kathmandu', 'star-trek', 'Patan', 'Comet', 'Death', 'life', 'religion', 'spiritual', 'technology', 'AI', 'world', 'starbucks', 'people', 'anime', 'stress', 'candy', 'pole', 'starch', 'struck', 'people in black and white'];
let keywords = [];
const getTags = async () => {
    const response = await fetch('http://127.0.0.1:8000/tags');
    const data = await response.json();
    keywords = data.map(item => item.title);
    console.log("Tags from DB ====> ", keywords);
}


const listenSearchInput = (e) => {
    getTags();
    const input = e.target.value.toLowerCase();
    const inputLength = input.length;
    
    searchBarInfoContainer.classList.toggle('active', inputLength === 0);
    searchBarRecommendationInfoContainer.classList.remove('active');

    if (inputLength < 2) return;
    
    const results = keywords.filter(item => item.toLowerCase().includes(input));
    
    if (results.length > 0) {
        searchBarRecommendationInfoContainer.classList.add('active');
    }

    recommendedSearchList.innerHTML = "";
    for (let item of results) {
        addRecommendedSearchesToDOM(item);
    }
}

function addRecommendedSearchesToDOM(item) {
    const recommendationListItem = document.createElement('li');
    const recommendationTag = document.createElement('a');
    recommendationTag.classList.add('recommended-search-tag');
    recommendationTag.textContent = item;
    recommendationTag.href = `${SEARCH_BASE_URL}${item}`;
    recommendationListItem.appendChild(recommendationTag)
    recommendedSearchList.appendChild(recommendationListItem);
}

searchFormInput.addEventListener('input', listenSearchInput);

searchFormInput.removeEventListener('blur', listenSearchInput);

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchQuery = searchFormInput.value.trim();

    if (searchQuery === '') return;

    if (!recentSearches.includes(searchQuery)) {
        if (recentSearches.length >= MAX_RECENT_SEARCHES_LEN) {
            recentSearches.pop();
            recentSearches.unshift(searchQuery);
        } else {
            recentSearches.unshift(searchQuery);
        }
    } else {
        const idx = recentSearches.indexOf(searchQuery);
        recentSearches.splice(idx, 1);
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
    if (searchBarRecommendationInfoContainer.classList.contains('active')) return;
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
};