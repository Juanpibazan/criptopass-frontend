export const initialState = {
    activeTitle: localStorage.getItem('activeTitle') ==='undefined' ? localStorage.clear() : localStorage.getItem('activeTitle'),
    user: localStorage.getItem('user') ==='undefined' ? localStorage.clear() : JSON.parse(localStorage.getItem('user')),
    jwtoken: localStorage.getItem('jwtoken') ==='undefined' ? localStorage.clear() : localStorage.getItem('jwtoken'),
};