import axios from 'axios'


const token = import.meta.env.VITE_NOTEHUB_TOKEN


if (!token) {
console.warn('VITE_NOTEHUB_TOKEN is not defined. Set it in .env');
}


export const api = axios.create({
baseURL: 'https://notehub-public.goit.study/api',
headers: {
Authorization: token ? `Bearer ${token}` : '',
'Content-Type': 'application/json',
},
})