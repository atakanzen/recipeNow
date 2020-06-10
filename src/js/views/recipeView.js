import { elements } from './base'
import { Fraction } from 'fractional';

const formatCount = count => {
    if (count) {
        // 2.5 => 2 1/2
        // 0.5 => 1/2
        const newCount = Math.round(count * 10000) / 10000;
        const [int, dec] = newCount.toString().split('.').map(el=> parseInt(el,10))

        if (!dec) return newCount;
        if (int === 0) {
            const frac = new Fraction(newCount);
            return `${frac.numerator}/${frac.denominator}`
        } else {
            const frac = new Fraction(newCount - int);
            return `${int} ${frac.numerator}/${frac.denominator}`
        }
    }
    return '?';
};

const createIngredient = ingredient => `
    <li class="recipe__item">
        <img class="recipe__icon"
            src="img/success.png">
        </img>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`
export const clearRecipe = () => {
    elements.recipe.innerHTML = "";
}
export const renderRecipe = (recipe,isLiked) => {
    const markup = `
    <figure class="recipe__fig">
    <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
    <h1 class="recipe__title">
        <span>${recipe.title}</span>
    </h1>
</figure>
<div class="recipe__details">
    <div class="recipe__info">
        <img class="recipe__info-icon"
           src="img/clock.png">
        </img>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
        <img class="recipe__info-icon"
            src="img/user.png">
        </img>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-decrease">
                <img
                    src="img/minus.png">
                </img>
            </button>
            <button class="btn-tiny btn-increase">
                <img
                    src="img/plus.png">
                </img>
            </button>
        </div>

    </div>
    <button class="recipe__love">
        <img class="header__likes"
            src="img/heart${isLiked ? '' : '-outlined'}.png">
        </img>
    </button>
</div>



<div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map(el => createIngredient(el)).join(' ')}
    </ul>

    <button class="btn-small recipe__btn recipe__btn--add">
        <img class="search__icon"
            src="img/shopping-cart.png">
        </img>
        <span>Add to shopping list</span>
    </button>
</div>

<div class="recipe__directions">
    <h2 class="heading-2">How to cook?</h2>
    <p class="recipe__directions-text">
        This recipe was provided by
        <span class="recipe__by">${recipe.publisher}</span>. Please check out their website for more information.
    </p>
    <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
        <span>MORE INFO</span>
        <img class="search__icon"
            src="img/next-white.png">
        </img>

    </a>
</div>
`;

elements.recipe.insertAdjacentHTML('afterbegin',markup);

};

export const updateServingsIngredients = recipe => {
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el,i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    })
}