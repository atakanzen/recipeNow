import { elements, stopLoader } from './base';


export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'))
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

export const shortenTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, curr) => {
            if(acc + curr.length <= limit) {
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0)
        return `${newTitle.join(' ')} ...`;
    } 
    return title;
}

const renderRecipe = recipe => {
    const markup = `
            <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${shortenTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend',markup);
}

export const clearInput = () => {
    elements.searchInput.value='';
}

export const clearResults = () => {
    elements.searchResultsList.innerHTML = "";
    elements.searchResPages.innerHTML = "";
}

export const getInput = () => elements.searchInput.value;

const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1 }>
        <span>Page ${type === 'prev' ? page - 1 : page + 1 }</span>
            <img class="search__icon"
                src="img/${type === 'prev' ? 'back.png' : 'next.png'}">
            </img>
        </button>       
`

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // NEXT PAGE BUTTON
        button = createButton(page,'next')
    } else if (page < pages) {
        // BOTH BUTTONS
        button = `
            ${createButton(page,'prev')}
            ${createButton(page,'next')}
        `
    } else if (page === pages && pages > 1) {
        // PREVIOUS PAGE BUTTON
        button = createButton(page, 'prev')
    } 
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
    renderButtons(page, recipes.length,resPerPage);
}

