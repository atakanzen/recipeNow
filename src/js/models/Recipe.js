import axios from 'axios';
import 'core-js/stable';
import 'regenerator-runtime';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url
            this.url = res.data.recipe.source_url,
            this.ingredients = res.data.recipe.ingredients;
            // console.log(res.data);
            // console.log(this.recipe);
        } catch (err) {
            console.log(err);
            alert(`I guess you should just order in... \n${err}`);
        }
    }

    calcTime() {
        // Estimating cooking time, because why not.
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15
    }

    calcServings() {
        this.servings = 4;
    }

    editIngredients() {
        const unitsRaw = ['tablespoons', 'tablespoon','ounces' , 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsEdited = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsRaw, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el => {
            
            // FORMING UNITS   
            let ingredient = el.toLowerCase();
            unitsRaw.forEach((unit, idx) => {
                ingredient = ingredient.replace(unit, unitsEdited[idx]);
            })

            // REMOVE PARENTHESES
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')

            // PARSE INGREDIENTS
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1) {
                const arrCount = arrIng.slice(0,unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'))
                } else {
                    count = eval(arrIng.slice(0,unitIndex).join('+'))
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0],10)) {
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient,
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // SERVINGS
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        // INGREDIENTS
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings)
        });
        
        this.servings = newServings;

    }
}