import axios from 'axios';


export class apiServer {
    constructor() {
        this.serchQuery = '';
        this.page = 1;
    }
    async fetchAxios() {
        this.incrementPage();
        return await axios.get('https://pixabay.com/api/?key=25615179-bc6a5ca344d9399e59b708cec', {
            params: {
            q: `${this.serchQuery}`,
            page: `${this.page}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: 40,  
            },
        })
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.serchQuery;
    }

    set query(newQuery) {
        this.serchQuery = newQuery;
    }

}