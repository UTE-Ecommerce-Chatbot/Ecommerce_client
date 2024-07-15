    import React, { useCallback, useEffect, useState } from 'react'
    import { useDispatch, useSelector } from 'react-redux';
    import { Link, Redirect } from 'react-router-dom'
    import { currency } from 'utils/FormatCurrency'
    import { makePaymentVnpay, makePaymentZaloPay, makePaymentMomo } from 'actions/services/PaymentActions'
    import AddressForm from 'components/form/AddressForm';
    import { addOrder } from 'actions/services/OrderActions'
    import { completeCart, getCartInfo, getDetailCartSelected } from 'actions/services/CartActions';
    import { toast } from 'react-toastify'
    import "react-toastify/dist/ReactToastify.css";
    import { getUserLogin } from 'actions/services/UserActions';
    import Loading from 'components/Loading/Loading';
    import { getPaymentMethods } from 'actions/services/PaymentServices';
    import { calculateShipFeeGHN } from 'actions/services/GHNServices';
    import _ from 'lodash'
    import useTimeout from 'hooks/useTimeout';
    import { calculateShipFeeGHTK } from 'actions/services/GHTKServices';

    const shipmethods = [
        {
            type: 1,
            name: 'Giao Hàng Nhanh'
        },
        {
            type: 2,
            name: "Giao Hàng Tiết Kiệm"
        }
    ]

    const payMethods = [
        {
            type: 1,
            name: 'Thanh toán tiền mặt khi nhận hàng'
        },
        {
            type: 2,
            name: "Thanh toán bằng ví VnPay"
        },
        {
            type: 3,
            name: 'Thanh toán bằng ví Momo'
        },
        {
            type: 4,
            name: "Thanh toán bằng ví ZaloPay"
        }
    ]
    

    const icon_bank = [
        "https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-cod.svg",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        // "https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-mo-mo.svg",
        "https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-zalo-pay.svg",
    ]

    function PaymentPage(props) {
        const dispatch = useDispatch();
        const cart = useSelector(state => state.cart.cartSelected);
        const [user, setUser] = useState({})
        const [openAddress, setOpenAddress] = useState(false);
        // const [payMethods, setPayMethods] = useState([])
        const [type, setType] = useState(1);
        const [shipInfo, setShipInfo] = useState({})
        const [loading, setLoading] = useState(true);
        const token = localStorage.getItem('token');
        const [shipType, setShipType] = useState(1);

        const getUser = useCallback(() => {
            getUserLogin()
                .then(res => {
                    setUser(res.data);
                })
                .catch(err => console.log(err))
        }, [])

        const getCalculateShipFee = useCallback(() => {
            if (!_.isEmpty(user)) {
                if (shipType === 1) {
                    console.log(shipType,"GHN")
                    calculateShipFeeGHN({
                        from_district_id: 1542,
                        service_id: 53320,
                        service_type_id: null,
                        to_district_id: user?.district_id,
                        to_ward_code: user?.ward_id,
                        weight: cart?.weight,
                        length: cart?.length,
                        width: cart?.width,
                        height: cart?.height
                    })
                        .then((res => {
                            setShipInfo(res.data)
                        }))
                        .catch(err => console.log(err))
                } else {
                    console.log(shipType,"GHTK")
                    calculateShipFeeGHTK({
                        pick_province: 'Hà Nội',
                        pick_district: 'Quận Hai Bà Trưng',
                        province: user?.city,
                        district: user?.district,
                        weight: cart?.weight,
                        deliver_option: 'none',
                        value: cart?.total_price,
                        // value: 3000000,

                        // pick_province: "Hà Nội",
                        // pick_district: "Quận Hai Bà Trưng",
                        // province: "Hà nội",
                        // district: "Quận Cầu Giấy",
                        // address: "P.503 tòa nhà Auu Việt, số 1 Lê Đức Thọ",
                        // weight: 1000,
                        // value: 3000000,
                    })
                        .then((res => {
                            setShipInfo(res.data)
                        }))
                        .catch(err => console.log(err))
                }
            }
        }, [cart?.height, cart?.length, cart?.weight, cart?.width, shipType, user,cart?.total_price])

        useEffect(() => {
            getUser();
        }, [getUser])

        useEffect(() => {
            getCalculateShipFee();
        }, [getCalculateShipFee])

        const handleClickOpenAddress = () => {
            setOpenAddress(true);
        };

        const handleCloseAddress = () => {
            getUser();
            setOpenAddress(false);
        }

        const handleCompleteCart = () => {
            completeCart()
                .then(() => {
                    dispatch(getCartInfo())
                })
                .catch(err => console.log(err))
        }

        function getPayMethodsList() {
            getPaymentMethods()
                .then((res) => {
                    // setPayMethods(res.data.content.sort((a, b) => a.id - b.id));
                })
                .catch(err => console.log(err));
        }

        useEffect(() => {

            document.title = "Thông tin thanh toán"

            if (token) {
                dispatch(getDetailCartSelected())
            } else {
                props.history.push('/login');
            }
            getPayMethodsList();
        }, [dispatch, props.history, token])

        const calculateShipFeeIfTotalMorethan3Mil = (total) => {
            let fee = shipInfo?.total_ship_fee;
            return fee;
        }

        const calculateTotalOrder = (total) => {
            let fee = calculateShipFeeIfTotalMorethan3Mil(total);
            return fee + total;
        }

        useTimeout(() => setLoading(false), loading ? 2000 : null);



        const handlePayment = () => {
                
            
            if (cart?.cart_details.length === 0) {
                toast.error('Đặt hàng không thành công. Giỏ hàng không có sản phẩm!', {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            } else if ((user?.city_id === null && user?.district_id === null) || user?.phone === null) {
                toast.warning('Đặt hàng không thành công. Vui lòng cập nhật thông tin giao hàng !', {
                    position: "bottom-center",
                    theme: 'dark',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            } else {
                
                let orderInfo = {}
                orderInfo.appuser = user.username;
                orderInfo.amount = calculateTotalOrder(cart?.total_price);
                orderInfo.vnp_OrderInfo = "Thanh toan doan hang";
                orderInfo.vnp_Amount = calculateTotalOrder(cart?.total_price);
                console.log(0)
                console.log(1111,type)
                if (type === 3) {
                    console.log(3)
                    let now = new Date();
                    const create_time = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
                    const order_details = cart?.cart_details.map(item => {
                        return {
                            product_id: item.product_id,
                            color: item.color,
                            quantity: item.quantity,
                            price: item.price,
                            total_price: item.price * item.quantity
                        }
                    })
                    const payment = {
                        type: 1,
                        method_code: 'momo',
                        datePayment: create_time,
                        tradingCode: null,
                        status: 0
                    }

                    const order = {
                        username: user.username,
                        email: user.email,
                        customer_name: user?.fullName,
                        total_price: orderInfo.amount,
                        total_item: cart?.items_count,
                        order_details: order_details,
                        orderInfo: "Thanh toan don hang",
                        address: user ? user?.house : "",
                        province: user ? user?.city : "",
                        district: user ? user?.district : "",
                        ward: user ? user?.ward : "",
                        payment: payment,
                        phone: user?.phone,
                        name: user?.fullName,
                        ward_code: user?.ward_id,
                        district_id: user?.district_id,
                        ship_fee: calculateShipFeeIfTotalMorethan3Mil(cart?.total_price),
                        ship_type: shipType
                    }
                    addOrder(order)
                        .then((res) => {
                            localStorage.setItem('order_id', res.id);
                            orderInfo.order_id = res.id;
                            makePaymentMomo(orderInfo)
                                .then((res1) => {
                                    if (res1.data.errorCode === 0 || res1.data.errorCode === "0") {
                                        window.location.href = res1.data.payUrl;
                                    } else {
                                        toast.warning('Có lỗi xảy ra, mời thực hiện lại!');
                                    }

                                })
                            handleCompleteCart();
                        })
                        .catch(() => toast.error('Đặt hàng không thành công, mời thực hiện lại!', {
                            position: "bottom-center",
                            theme: 'dark',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        }))
                } else if (type === 4) {
                    console.log(4)
                    let now = new Date();
                    const create_time = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
                    const order_details = cart?.cart_details.map(item => {
                        return {
                            product_id: item.product_id,
                            color: item.color,
                            quantity: item.quantity,
                            price: item.price,
                            total_price: item.price * item.quantity
                        }
                    })
                    const payment = {
                        type: 1,
                        method_code: 'zalopay',
                        datePayment: create_time,
                        tradingCode: null,
                        status: 0
                    }

                    const order = {
                        username: user.username,
                        email: user.email,
                        customer_name: user?.fullName,
                        total_price: orderInfo.amount,
                        total_item: cart?.items_count,
                        order_details: order_details,
                        orderInfo: "Thanh toan don hang",
                        address: user ? user?.house : "",
                        province: user ? user?.city : "",
                        district: user ? user?.district : "",
                        ward: user ? user?.ward : "",
                        payment: payment,
                        phone: user?.phone,
                        name: user?.fullName,
                        ward_code: user?.ward_id,
                        district_id: user?.district_id,
                        ship_fee: calculateShipFeeIfTotalMorethan3Mil(cart?.total_price),
                        ship_type: shipType
                    }
                    addOrder(order)
                        .then((res) => {
                            localStorage.setItem('order_id', res.id);
                            orderInfo.order_id = res.id;
                            makePaymentZaloPay(res, orderInfo)
                                .then((res1) => {
                                    if (res1.data.returncode === 1) {
                                        window.location.href = res1.data.orderurl;
                                    } else {
                                        toast.warning('Có lỗi xảy ra, mời thực hiện lại!');
                                    }

                                })
                            handleCompleteCart();
                        })
                        .catch(() => toast.error('Đặt hàng không thành công, mời thực hiện lại!', {
                            position: "bottom-center",
                            theme: 'dark',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        }))
                } else if (type === 2) {
                    console.log(2)
                    let now = new Date();
                    const create_time = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
                    const order_details = cart?.cart_details.map(item => {
                        return {
                            product_id: item.product_id,
                            color: item.color,
                            quantity: item.quantity,
                            price: item.price,
                            total_price: item.price * item.quantity
                        }
                    })
                    const payment = {
                        type: 1,
                        method_code: 'vnpay',
                        datePayment: create_time,
                        tradingCode: null,
                        status: 0
                    }

                    const order = {
                        username: user.username,
                        email: user.email,
                        customer_name: user?.fullName,
                        total_price: orderInfo.vnp_Amount,
                        total_item: cart?.items_count,
                        order_details: order_details,
                        orderInfo: orderInfo.vnp_OrderInfo,
                        address: user ? user?.house : "",
                        province: user ? user?.city : "",
                        district: user ? user?.district : "",
                        ward: user ? user?.ward : "",
                        payment: payment,
                        phone: user.phone,
                        name: user.fullName,
                        ward_code: user?.ward_id,
                        district_id: user?.district_id,
                        ship_fee: calculateShipFeeIfTotalMorethan3Mil(cart?.total_price),
                        ship_type: shipType
                        
                    }
                    addOrder(order)
                        .then((res) => {
                            localStorage.setItem('order_id', res.id);
                            makePaymentVnpay(orderInfo)
                                .then((res) => {
                                    window.location.href = res.data.redirect_url;
                                })
                            handleCompleteCart();
                        })
                        .catch(() => toast.error('Đặt hàng không thành công, mời thực hiện lại!', {
                            position: "bottom-center",
                            theme: 'dark',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        }))
                } else if (type === 1) {
                    console.log(1)
                    let now = new Date();
                    const create_time = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
                    const order_details = cart?.cart_details.map(item => {
                        return {
                            product_id: item.product_id,
                            color: item.color,
                            quantity: item.quantity,
                            price: item.price,
                            total_price: item.price * item.quantity
                        }
                    })
                    const payment = {
                        bankName: null,
                        method_code: 'cod',
                        datePayment: create_time,
                        tradingCode: null,
                        status: 0
                    }
                    const order = {
                        username: user.username,
                        email: user.email,
                        customer_name: user?.fullName,
                        total_price: orderInfo.vnp_Amount,
                        total_item: cart?.items_count,
                        order_details: order_details,
                        orderInfo: orderInfo.vnp_OrderInfo,
                        address: user ? user?.house : "",
                        province: user ? user?.city : "",
                        district: user ? user?.district : "",
                        ward: user ? user?.ward : "",
                        ward_code: user?.ward_id,
                        district_id: user?.district_id,
                        payment: payment,
                        phone: user.phone,
                        name: user.fullName,
                        ship_fee: calculateShipFeeIfTotalMorethan3Mil(cart?.total_price),
                        ship_type: shipType
                    }
                    addOrder(order)
                        .then((res) => {
                            props.history.push(`/success/payment?order_id=${res.id}`)
                            toast.success('Đặt hàng thành công!', {
                                position: "bottom-center",
                                theme: 'dark',
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            handleCompleteCart();
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            }
        }

        return (
            <>
                <div className="row sm-gutter section__content">
                    <div className="col l-12 m-12 c-12">
                        <div className="home-product">
                            {
                                (loading) ? <Loading /> : (
                                    <div className="bkMhdM">
                                        {
                                            cart?.cart_details && cart?.cart_details.length === 0 ? (
                                                <div className="cwMaQD">
                                                    Giỏ hàng không có sản phẩm. Vui lòng thực hiện lại.
                                                </div>
                                            ) : ""
                                        }
                                        <h4 className="productsV2__title">Thanh toán đơn hàng</h4>

                                        <div className="row sm-gutter">
                                            <div className="col l-9 m-12 c-12">
                                                <div className="deellp">
                                                    <div className="kRoZux">
                                                        <h3 className="title">1. Thông tin sản phẩm</h3>
                                                        <div className="cDxQbC">
                                                            <div className="iLupwL">
                                                                <div className="productsV2-content">
                                                                    <div className="infinite-scroll-component" style={{ height: 'auto', overflow: 'auto' }}>
                                                                        <ul className="fhrjkV">
                                                                            {
                                                                                cart?.cart_details && cart?.cart_details.map((item, index) => {
                                                                                    return (
                                                                                        <li className="iMeYki" key={index}>
                                                                                            <div className="row">
                                                                                                <div className="col-1">
                                                                                                    <div className="intended__images false">
                                                                                                        <Link className="intended__img" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                            <img src={`${item.mainImage}`} alt="" />
                                                                                                        </Link>
                                                                                                        <div className="intended__content">
                                                                                                            <Link className="intended__name" to={`/san-pham/${item.product_id}/${item.slug}`}>
                                                                                                                {item.name}
                                                                                                            </Link>
                                                                                                            <span className="intended__not-bookcare">SL: x{item.quantity}</span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2">
                                                                                                    <span className="intended__real-prices">{currency(item.price)}</span>
                                                                                                </div>
                                                                                                <div className="col-4">
                                                                                                    <span className="intended__final-prices">{currency(item.price * item.quantity)}</span>
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
                                                    <div className="kRoZux">
                                                        <h3 className="title">2. Chọn hình thức giao hàng</h3>
                                                        <div className="dnENUJ">
                                                            <ul className="list">
                                                                {
                                                                    shipmethods.map((item, index) => {
                                                                        return (
                                                                            <li className="dWHFNX" key={index}>
                                                                                <label className="HafWE">
                                                                                    <input type="radio" readOnly name="ship-methods" onChange={(e) => setShipType(item.type)} value={item.type} defaultChecked={item?.type === type} /><span className="radio-fake" />
                                                                                    <span className="label">
                                                                                        <div className="fbjKoD">
                                                                                            <div className="method-content">
                                                                                                <div className="method-content__name"><span>{item.name}</span></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </span>
                                                                                </label>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="kRoZux">
                                                        <h3 className="title">3. Chọn hình thức thanh toán</h3>
                                                        <div className="dnENUJ">
                                                            <ul className="list">
                                                                {
                                                                    payMethods.map((item, index) => {
                                                                        return (
                                                                            <li className="dWHFNX" key={index}>
                                                                                <label className="HafWE">
                                                                                    <input type="radio" readOnly name="payment-methods" onChange={(e) => setType(item.type)}  value={item.type} defaultChecked={item?.type === type} /><span className="radio-fake" />
                                                                                    <span className="label">
                                                                                        <div className="fbjKoD">
                                                                                            <img className="method-icon" width="32" src={icon_bank[index]} alt="" />
                                                                                            <div className="method-content">
                                                                                                <div className="method-content__name"><span>{item.name}</span></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </span>
                                                                                </label>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="group-button">
                                                        {
                                                            user ? <Link to="#" onClick={handlePayment} type="button" className="btn btn-add-to-cart">Đặt Mua</Link> :
                                                                <Redirect to="/login" />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        <div className="col l-3 m-3 c-12">
                                            <div className="gDuXAE">
                                                <div className="title">
                                                    <span>Thông tin giao hàng</span>
                                                    <Link to="#" onClick={handleClickOpenAddress} >Sửa</Link>
                                                </div>
                                                <div className="address">
                                                    <span className="name">
                                                        {user?.fullName} | {user?.phone}
                                                    </span>
                                                    {
                                                        (user?.city && user?.district && user?.ward) ? (
                                                            <span className="street">
                                                                {user ? user?.house + ", " + user?.ward + ", " + user?.district + ", " + user?.city : ''}
                                                            </span>
                                                        ) : <span className="street">
                                                            Vui lòng cập nhật thông tin giao hàng
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                            <div className="gDuXAE">
                                                <div className="title">
                                                    <span>Đơn hàng {cart?.cart_details && cart?.cart_details.length} sản phẩm </span>
                                                    <Link to="/checkout/cart">Sửa</Link>
                                                </div>
                                                <div className="address">
                                                    <div className="product product--show">
                                                        {
                                                            cart?.cart_details && cart?.cart_details.map((item, index) => {
                                                                return (
                                                                    <div className="order_info-list" key={index}>
                                                                        <div className="info">
                                                                            <strong className="qty">{item.quantity} x</strong>
                                                                            <Link to={`/san-pham/${item.product_id}/${item.slug}`} target="_blank" className="product-name">
                                                                                {item.name}
                                                                            </Link>
                                                                        </div>
                                                                        <div className="price">{currency(item.price)}</div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cart-total">
                                                <div className="cart-total-prices">
                                                    <div className="cart-total-prices__inner">
                                                        <div className="etSUOP">
                                                            <div className="prices">
                                                                <ul className="prices__items">
                                                                    <li className="prices__item">
                                                                        <span className="prices__text">Tạm tính</span>
                                                                        {
                                                                            (user?.city && user?.district && user?.ward && cart?.cart_details && cart?.cart_details.length > 0) ? (
                                                                                <span className="prices__value">{currency(cart?.total_price)}</span>
                                                                            ) : <span className="prices__value">
                                                                                {currency(0)}
                                                                            </span>
                                                                        }

                                                                    </li>
                                                                    <li className="prices__item">
                                                                        <span className="prices__text">Phí vận chuyển</span>
                                                                        {
                                                                            
                                                                            (user?.city && user?.district && user?.ward && cart?.cart_details && cart?.cart_details.length > 0) ? (
                                                                                <span className="prices__value">{currency(calculateShipFeeIfTotalMorethan3Mil(cart?.total_price))}</span>
                                                                            ) : <span className="prices__value">
                                                                                {currency(0)}
                                                                            </span>
                                                                        }
                                                                    </li>
                                                                </ul>
                                                                <p className="prices__total">
                                                                    <span className="prices__text">Tổng cộng</span>
                                                                    {
                                                                        (user?.city && user?.district && user?.ward && cart?.cart_details && cart?.cart_details.length > 0) ? (
                                                                            <span className="prices__value prices__value--final">
                                                                                {currency(calculateTotalOrder(cart?.total_price))}
                                                                                <i>(Đã bao gồm VAT nếu có)</i>
                                                                            </span>
                                                                        ) : <span className="prices__value prices__value--final">
                                                                            {currency(0)}
                                                                            <i>(Đã bao gồm VAT nếu có)</i>
                                                                        </span>
                                                                    }

                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                    </div>
                </div>
            </div>
            {
                openAddress ? <AddressForm open={openAddress} onClose={handleCloseAddress} /> : ''
            }
        </>
    )
}
export default PaymentPage;