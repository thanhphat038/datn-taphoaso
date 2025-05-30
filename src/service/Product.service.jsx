import axios from "axios";

export const dataProduct = () => {
    return axios.get("https://fakestoreapi.com/products");
};

// export const updatedata = (id, content) => {
//     return axios.put(`https://fakestoreapi.com/products/${id}`, content);
// };
