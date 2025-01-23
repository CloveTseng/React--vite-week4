import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Pagination from '../components/Pagination';
import ProductModal from "../components/ProductModal";
import DelProductModal from "../components/DelProductModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
    }; 

const Product = () => {
const [pageInfo, setPageInfo] = useState({});
const [products, setProducts] = useState([]);
const handleOpenProductModal = (mode, product) => {
        setModalMode(mode);
    
        switch (mode) {
          case 'create':
            setTempProduct(defaultModalState);
            break;
    
          case 'edit':
            setTempProduct(product);
            break;
    
          default:
            break;
        }
    setIsProductModalOpen(true);
}
const handleOpenDelProductModal = (product) => {
    setTempProduct(product)
    setIsDelProductModalOpen(true)
}

const handlePageChange = (page) => {
    getProducts(page);
}

const [modalMode, setModalMode] = useState(null);
const [isProductModalOpen, setIsProductModalOpen] = useState(false);
const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

const getProducts = async (page = 1) => {
    try {
        const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
        );
        setProducts(res.data.products);
        setPageInfo(res.data.pagination)
    } catch (error) {
        alert(error,"取得產品失敗");
    }
};
useEffect(() => {
    getProducts();
},[])

const [tempProduct, setTempProduct] = useState(defaultModalState);

return (
    <>
        <div className="container py-5">
            <div className="row">
            <div className="col">
                <div className="d-flex justify-content-between mb-3">
                <button type="button" className="btn btn-primary" onClick={() => handleOpenProductModal('create')}>建立新的產品</button>
                </div>
                <table className="table">
                <thead>
                    <tr>
                    <th scope="col">分類</th>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                    <tr key={product.id}>
                        <th scope="row">{product.category}</th>
                        <td>{product.title}</td>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}</td>
                        <td>
                        <button type="button" className="btn btn-outline-success btn-sm rounded-0 rounded-start" onClick={() => handleOpenProductModal('edit', product)}>編輯</button>
                        <button type="button" className="btn btn-outline-danger btn-sm rounded-0 rounded-end" onClick={() => handleOpenDelProductModal(product)}>刪除</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
            </div>
        </div>
        <ProductModal 
        isOpen={isProductModalOpen} 
        setIsOpen={setIsProductModalOpen} 
        modalMode={modalMode} 
        tempProduct={tempProduct} 
        getProducts={getProducts} />
        <DelProductModal 
        isOpen={isDelProductModalOpen} 
        setIsOpen={setIsDelProductModalOpen}
        tempProduct={tempProduct} 
        getProducts={getProducts} />
    </>

)
}

export default Product