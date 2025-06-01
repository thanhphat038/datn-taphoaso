import { useEffect, useState } from "react";
import { dataProduct, dataProductDetail } from "../service/Product.service";
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

export const useProductDetailData = (id) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            const item = await dataProductDetail(id);
            setProduct(item.data);
        };
        fetchProductDetail();
    }, [id]);

    return product;
};
