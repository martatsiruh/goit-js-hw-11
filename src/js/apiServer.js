import axios from 'axios';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '25615179-bc6a5ca344d9399e59b708cec';

export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

  async fetchAxios() {
    try {
      const searchParams = new URLSearchParams({
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.page,
      });

      Loading.pulse();
      const response = await axios.get(`${BASE_URL}?${searchParams}`);
      this.incrementPage();
      Loading.remove();

      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

/*
export class apiServer {
    constructor() {
        this.serchQuery = '';
        this.page = 0;
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

}*/