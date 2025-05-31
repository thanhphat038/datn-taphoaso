import axios from "axios";

export const dataProduct = () => {
    return axios.get("http://localhost:3001/products");
};

export const dataProductDetail = (id) => {
    return axios.get(`http://localhost:3001/products?id=${id}`);
};

// export const updatedata = (id, content) => {
//     return axios.put(`https://fakestoreapi.com/products/${id}`, content);
// };


