import axios from "axios";

const api = "http://localhost:3000/api";

export const dataProduct = () => {
    return axios.get(`${api}/products`);
};

export const dataProductDetail = (_id) => {
    return axios.get(`${api}/products/${_id}`);
};

// export const updatedata = (id, content) => {
//     return axios.put(`https://fakestoreapi.com/products/${id}`, content);
// };


