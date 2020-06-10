import axios from 'axios';
import 'core-js/stable';
import 'regenerator-runtime';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch(err) {
            console.log(err);
            alert(`I guess you should just order in... \n${err}`);
        }
       
    }
}



