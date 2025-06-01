import axios from "axios";

const api = "http://localhost:3001";

export const dataProduct = () => {
    return axios.get(`${api}/products`);
};

export const dataProductDetail = (id) => {
    return axios.get(`${api}/products?id=${id}`);
};

// export const updatedata = (id, content) => {
//     return axios.put(`https://fakestoreapi.com/products/${id}`, content);
// };


