import { useEffect, useState } from "react";
import { dataProduct } from "../service/Product.service";
import Product from "../components/Product";

export const useProductData = (category, limit) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            const item = await dataProduct();
            setProducts(item.data);
        };
        fetchProduct();
    }, []);

    const filtered = category && isNaN(category)
        ? products.filter(p => p.category === category)
        : products;

    return filtered.slice(0, isNaN(category) ? limit : category).map((element, index) => (
        <Product key={index} data={element} />
    ));
};
