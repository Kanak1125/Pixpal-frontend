const filterIcon = document.querySelector('.filter-icon');
const filterModal = document.querySelector('.modal-filter');
const modalCloseBtn = document.querySelector('.close-btn');
const mainFilterCloseBtn = document.querySelector('.main-filter-close-btn');
const mainFilterContainer = document.querySelector('.main-filter-container');
const mainContainer = document.querySelector('.container');
const filtersBtn = document.querySelector('.filters-btn');


filterIcon.addEventListener('click', () => {
    filterModal.showModal();
    document.body.style.overflow = "hidden";
})

modalCloseBtn.addEventListener('click', () => {
    filterModal.close();
    document.body.style.overflow = "scroll";
});

const handleMainFilterBtn = () => {
    mainFilterCloseBtn.addEventListener('click', () => {
        mainFilterContainer.style.display = "none";
        mainContainer.classList.remove('add-grid');
        console.log(filtersBtn);
        filtersBtn.classList.remove('hide-filters-btn');
    });
    
    filtersBtn.addEventListener('click', () => {
        mainFilterContainer.style.display = "block";
        mainContainer.classList.add('add-grid');
        console.log(filtersBtn);
        filtersBtn.classList.add('hide-filters-btn');
    });
};

export default handleMainFilterBtn;