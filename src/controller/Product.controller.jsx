import { useEffect, useState } from "react";
import { dataProduct, dataProductDetail, getRelatedProducts } from "../service/Product.service";
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
    // console.log(id);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            const item = await dataProductDetail(id);
            setProduct(item.data);
        };
        fetchProductDetail();
    }, [id]);
    console.log(product);
    return product;
};

export const useRelatedProducts = (id, limit = 5) => {
    const [related, setRelated] = useState([]);
    useEffect(() => {
        if (!id) return;
        const fetchRelated = async () => {
            try {
                const res = await getRelatedProducts(id, limit);
                setRelated(res.data.data || []);
            } catch (err) {
                setRelated([]);
            }
        };
        fetchRelated();
    }, [id, limit]);
    return related;
};
