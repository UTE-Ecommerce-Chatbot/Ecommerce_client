import React, {useEffect, useState, useCallback} from 'react'
import {useDispatch} from 'react-redux';
import {currency} from "utils/FormatCurrency"
import {Link, useHistory} from 'react-router-dom';
import {API_URL,DECREASE_IMG,INCREASE_IMG} from 'actions/constants/constants'
import {getCurrentUser} from 'actions/services/UserActions'
import {
    addViewedProduct, getListProductMostPopular, getListProductViewedByUser, getOneItem
} from 'actions/services/ProductServices'
import {addLikeProduct, deleteProductLiked, getProductLiked} from 'actions/services/ProductServices'
import {getAllCommentByProductId} from 'actions/services/CommentServices'
import {getListRecommendForUser, getSimilarProduct} from 'actions/services/RecommendServices'
import {addProductToCart, getCartInfo} from 'actions/services/CartActions'
import "react-toastify/dist/ReactToastify.css";
import useTimeout from 'hooks/useTimeout';
import DetailProductSkeleton from 'components/Loading/DetailProductSkeleton';
import DetailsThumbnail from 'components/Item/DetailThumbnail';
import ProductItem from 'components/Item/ProductItem';
import ProductItemSkeleton from 'components/Item/ProductItemSkeleton';
import BrandProduct from 'components/Brand/BrandProduct';
import {toast} from 'react-toastify';

function CompareProduct(props) {

    const dispatch = useDispatch();
    const {match} = props;
    console.log("match", match);
    const [product1, setProduct1] = useState({});
    const [product2, setProduct2] = useState({});
    console.log("const_product", product1);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username')
    const params = new URLSearchParams(window.location.search)
    console.log("params", params);
    console.log("username", username);
    const getUser = useCallback(() => {
        dispatch(getCurrentUser())
    }, [dispatch])

    useEffect(() => {
        getUser();
    }, [getUser])

   

    useEffect(() => {
        document.title = product1.name ? `${product1?.name} | Tiki` : "Thông tin sản phẩm | Tiki"
    }, [product1?.name])

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (<>
            {!loading ? (<div className="row sm-gutter section__content">
                   
                    <div className="col l-12 m-12 c-12">
                        <div className="product-info">
                            {/* ------   Grid -> Row -> Column  ------ */}
                    
                           
                            <div className="row sm-gutter section__item">
                                <div className="col l-12 m-12 c-12">
                                    <div className="home-product-category-item">
                                        <h3 className="home-product-title">
                                            So sánh sản phẩm
                                        </h3>
                                    </div>
                                </div>
                                <div className="col l-12 m-12 c-12">
                                    <div className="group">
                                        <div className="content has-table">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>Thương hiệu</td>
                                                    <td>{product1?.brand?.name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Xuất xứ thương hiệu</td>
                                                    <td>{product1?.brand?.madeIn}</td>
                                                </tr>
                                                {product1?.product_specs?.map((item, index) => {
                                                    return (<tr key={index}>
                                                            <td>{item.attributeName}</td>
                                                            <td>{item.attributeValue}</td>
                                                        </tr>)
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>) : <DetailProductSkeleton/>}
        </>)
}

export default CompareProduct;
