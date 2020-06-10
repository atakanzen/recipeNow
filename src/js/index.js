import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, stopLoader } from './views/base';
import Likes from './models/Likes';

/**
 * Global State
 * - Search 
 * - Current Recipe 
 * - Shopping List
 * - Fav Recipes
 */
const state = {};


/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // GET QUERY STRING
    const query = searchView.getInput();


    
    if(query) {
        // NEW SEARCH => STATE
        state.search = new Search(query);
        // LOADING UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            // SEARCH RECIPES
            await state.search.getResults();

            // RENDER RESULTS
            stopLoader();
            searchView.renderResults(state.search.result)
        } catch (err) {
            console.log(err);
            alert(`I guess you should just order in... \n${err}`);
            stopLoader();
        }
        

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');

    if (id) {

        // LOADING UI
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // SELECTED
        if(state.search) searchView.highlightSelected(id);
        // NEW RECIPE
        state.recipe = new Recipe(id);
        try {
            // RECIPE DATA
            await state.recipe.getRecipe();
            state.recipe.editIngredients();
            // TIME & SERVINGS
            state.recipe.calcServings()
            state.recipe.calcTime();
            // RENDER RECIPE
            stopLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (err) { 
            console.log(err);
            alert(`I guess you should just order in... \n${err}`);
        }
        
    }
}

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/**
 * LIST CONTROLLER
 */

const controllerList = () => {
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    })
}


/**
 *  LIKE CONTROLLER
 */


const controllerLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currID = state.recipe.id;

    // Current recipe is NOT liked
    if(!state.likes.isLiked(currID)) {
        // add like to state
        const newLike = state.likes.addLike(
            currID,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        )
        // toggle like button
            likesView.toggleLikeBtn(true);
        // add like to list
            likesView.renderLikes(newLike);

    // Current recipe IS liked
    } else {
        // remove like from state
        state.likes.deleteLike(currID);
        // toggle like button
        likesView.toggleLikeBtn(false);
        // remove like from list
        likesView.deleteLike(currID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


// RESTORE LIKED RECIPES ON LOAD
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // RESTORE
    state.likes.readStorage();
    // TOGGLE BUTTON
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    // RENDER LIKES
    state.likes.likes.forEach(like => likesView.renderLikes(like));
});

// DELETE UPDATE LIST
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id, val);
    }

})

// RECIPE BUTTONS
elements.recipe.addEventListener('click',e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        if (state.recipe.servings < 10) {
            state.recipe.updateServings('inc');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.recipe__btn--add, recipe__btn--add *')) {
        controllerList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controllerLike();
    }
});


