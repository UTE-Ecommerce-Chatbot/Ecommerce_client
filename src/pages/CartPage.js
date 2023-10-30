import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { currency } from "utils/FormatCurrency"
import { Link, useHistory } from 'react-router-dom';
import { API_URL,DECREASE_IMG,INCREASE_IMG } from 'actions/constants/constants'
import { deleteItemInCart, getCartInfo, getDetailCart, updateQuantityItem, checkQuantityItemInCart, selectedItemToOrder } from 'actions/services/CartActions'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"; import Loading from 'components/Loading/Loading';
import useTimeout from 'hooks/useTimeout';
;

function CartPage(props) {

    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cart);
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    const handleDeleteItem = (product_id) => {
        deleteItemInCart(product_id)
            .then((res) => {
                toast.info(res.message, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatch(getCartInfo())
                dispatch(getDetailCart());
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleUpdateItem = (item, quantity) => {
        const data = {
            cart_details: [{
                product_id: item?.product_id,
                quantity
            }]
        }
        // dispatch(updateQuantityItem(data))
        updateQuantityItem(data)
            .then((res) => {
                if (res.message !== "SUCCESS") {
                    toast.info(res.message, {
                        position: "bottom-center",
                        theme: 'dark',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                dispatch(getCartInfo())
                dispatch(getDetailCart());
            })
            .catch((err) => {
                toast.warning(err, {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
    }

    const token = localStorage.getItem('token');

    const checkQuantity = () => {
        checkQuantityItemInCart(cart)
            .then((res) => {
                if (res.message === "SUCCESS") {
                    history.push("/checkout/payment")
                } else {
                    toast.info(res.message, {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            .catch(() => {
                toast.error('Thao tác không thành công!', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
    }

    useEffect(() => {

        document.title = "Giỏ hàng"

        if (token) {
            dispatch(getDetailCart())
        } else {
            props.history.push('/login');
        }
    }, [dispatch, props.history, token])

    const handleCheckedItemToOrder = (id) => {
        selectedItemToOrder(id)
            .then(() => dispatch(getDetailCart()))
            .catch(err => console.log(err))
            
    }

    useTimeout(() => setLoading(false), loading ? 1000 : null);

    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="bkMhdM">
                            <h4 className="productsV2__title">Giỏ hàng</h4>
                            {
                                loading ? <Loading /> : (
                                    <>
                                        {
                                            cart?.cart_details && cart?.cart_details.length > 0 ? (
                                                <div className="row sm-gutter">
                                                    <div className="col l-9 m-12 c-12">
                                                        <div className="productsV2-heading">
                                                            <div className="row">
                                                                <div className="col-1">
                                                                    <label className="kKoWwZ">
                                                                        <span className="label">{cart?.items_count} sản phẩm</span>
                                                                    </label>
                                                                </div>
                                                                <div className="col-2">Đơn giá</div>
                                                                <div className="col-3">Số lượng</div>
                                                                <div className="col-4">Thành tiền</div>
                                                                <div className="col-5">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="productsV2-content">
                                                            <div className="infinite-scroll-component " style={{ height: 'auto', overflow: 'auto' }}>
                                                                <div className="jfwAio">
                                                                    <div className="sellers">
                                                                        <ul className="fhrjkV">
                                                                            {
                                                                                cart?.cart_details.map((item, index) => {
                                                                                    return (
                                                                                        <li className="iMeYki" key={index}>
                                                                                            <div className="row">
                                                                                                <div className="col-1">
                                                                                                    <div className="intended__images">
                                                                                                        <div className="intended__checkbox">
                                                                                                            <label className="intended__checkbox-label">
                                                                                                                <input type="checkbox" readOnly checked={item.selected === 1} />
                                                                                                                <span className="checkbox-fake" onClick={() => handleCheckedItemToOrder(item.product_id)}></span>
                                                                                                            </label>
                                                                                                        </div>
                                                                                                        <Link className="intended__img" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                            <img src={item.mainImage} alt="" />
                                                                                                        </Link>
                                                                                                        <div className="intended__content">
                                                                                                            <Link className="intended__name" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                                {item.name}
                                                                                                            </Link>
                                                                                                            <span className="intended__not-bookcare">{item?.category.name}</span>
                                                                                                            <span className="intended__not-bookcare">{item?.brand.name}</span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2">
                                                                                                    <span className="intended__real-prices">{currency(item.price)}</span>
                                                                                                    <del className="intended__discount-prices">{currency(item.list_price)}</del>
                                                                                                </div>
                                                                                                <div className="col-3">
                                                                                                    <div className="intended-qty">
                                                                                                        <div className="bcFTqg">
                                                                                                            <span className="qty-decrease" onClick={() => handleUpdateItem(item, item.quantity - 1)}>
                                                                                                                <img src={`${DECREASE_IMG}`} alt="decrease" />
                                                                                                            </span>
                                                                                                            <input
                                                                                                                type="tel"
                                                                                                                className="qty-input"
                                                                                                                readOnly
                                                                                                                value={item.quantity}
                                                                                                            />
                                                                                                            <span className="qty-increase" onClick={() => handleUpdateItem(item, item.quantity + 1)}>
                                                                                                                <img src={`${INCREASE_IMG}`} alt="increase" />
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4">
                                                                                                    <span className="intended__final-prices">{currency(item.quantity * item.price)}</span>
                                                                                                </div>
                                                                                                <div className="col-5">
                                                                                                    <span className="intended__delete" onClick={() => handleDeleteItem(item.product_id)}>
                                                                                                        <img src={`data:image/png;base64,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`} alt="deleted" />
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col l-3 m-3 c-12">
                                                        <div className="cart-total">
                                                            <div className="cart-total-prices">
                                                                <div className="cart-total-prices__inner">
                                                                    <div className="etSUOP">
                                                                        <div className="prices">
                                                                            <ul className="prices__items">
                                                                                <li className="prices__item">
                                                                                    <span className="prices__text">Tạm tính</span>
                                                                                    <span className="prices__value">{currency(cart?.total_price)}</span>
                                                                                </li>
                                                                                <li className="prices__item">
                                                                                    <span className="prices__text">Giảm giá</span>
                                                                                    <span className="prices__value">0đ</span>
                                                                                </li>
                                                                            </ul>
                                                                            <p className="prices__total">
                                                                                <span className="prices__text">Tổng cộng</span>
                                                                                <span className="prices__value prices__value--final">{currency(cart?.total_price)}
                                                                                    <i>(Đã bao gồm VAT nếu có)</i>
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="group-button">
                                                                        <Link to="#" onClick={checkQuantity} className="btn btn-add-to-cart">Mua Hàng</Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="no-cart">
                                                    <img src={`${API_URL}/images/no-cart.png`} alt="" className="no-cart__img" />
                                                    <p className="no-cart__note">Không có sản phẩm nào trong giỏ hàng của bạn.</p>
                                                    <Link to="/" className="no-cart__btn">Tiếp tục mua sắm</Link>
                                                </div>
                                            )
                                        }
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CartPage;
