import { elements } from './base';
import { shortenTitle } from './searchView';

export const toggleLikeBtn = isLiked => {
    const icon = isLiked ? 'heart.png' : 'heart-outlined.png';
    document.querySelector('.recipe__love img').setAttribute('src', `img/${icon}`);
    // icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLikes = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.image}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${shortenTitle(like.title)}</h4>
                    <p class="likes__author">${like.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);   
}

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;

    if(el) el.parentElement.removeChild(el);
}