import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import AccountNavbar from 'components/AccountNavbar/AccountNavbar.';
import { currency } from 'utils/FormatCurrency'
import useTimeout from 'hooks/useTimeout';
import Loading from 'components/Loading/Loading';
import { getUserLogin } from 'actions/services/UserActions';
import Swal from "sweetalert2";
import { 
    getAllOrderByUser,
    cancelOrder,
    
 } from 'actions/services/OrderActions';

import { toast } from "react-toastify";
toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
  });

export default function HistoryOrder(props) {
    const [orderId, setOrderId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        id: '',
        fullName: '',
        username: '',
    })
    const handleSubmitOrder = async () => {
  const confirm = async (message) => {
    const confirmResult = await Swal.fire({
      title: "Xác nhận hủy đơn hàng",
      text: message,
      icon: "warning",
      buttons: ["Hủy", "Xác nhận"],
    });

    return confirmResult.value;
  };

  const confirmResult = await confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
        if (confirmResult ) {
          cancelOrder(orderId)
            .then((res) => {
              setLoading(false);
              if (res.message === "Huỷ đơn hàng thành công!") {
                toast.success(res.message);
                window.location.reload();
              } else {
                toast.warning(res.message);
              }
            })
            .catch((err) => {
              setLoading(false);
              toast.warning(err.response.message);
            });
        }
      };
    const getUser = () => {
        getUserLogin()
            .then(res => {
                setUser(res.data);
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {

        document.title = "Đơn hàng của tôi "

        getUser();

        getAllOrderByUser()
            .then((res) => {
                setOrders(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    useTimeout(() => setLoading(false), loading ? 500 : null);
    return (
        <>
            <div className="row sm-gutter section__content">
                <div className="col l-12 m-12 c-12">
                    <div className="home-product">
                        <div className="row sm-gutter section__item">
                            <div className="col l-2-4 m-3 c-3">
                                <AccountNavbar name={user?.fullName} />
                            </div>
                            <div className="col l-9-4 m-9 c-9">
                                <div className="list-cusomer-order">
                                    <div className="heading">Danh sách đơn hàng của tôi</div>
                                    {
                                        loading ? <Loading /> : (
                                            <table className="list__order-info">
                                                <thead>
                                                    <tr>
                                                        <th>Ngày mua</th>
                                                        <th>Sản phẩm</th>
                                                        <th>Tổng tiền</th>
                                                        <th>Trạng thái đơn hàng</th>
                                                        <th>Chi tiết đơn hàng</th>
                                                        {/* <th>Hủy đơn hàng</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        orders.map(item => {
                                                            return (
                                                                <tr key={item.id}>
                                                                    
                                                                    <td>{item.createdDate}</td>
                                                                    <td>{item.description}</td>
                                                                    <td>{currency(item.total_price + item.ship_fee)}</td>
                                                                    <td>{item.status_order_name}</td>
                                                                    <td>
                                                                        <Link to={`/customer/order/history/detail/${item.id}`} className="info-cusomer-order-link">
                                                                            Chi tiết
                                                                        </Link>
                                                                    </td>
                                                                    {/* <td>
                                                                    <p 
                                                                        className="cancelOrderE" 
                                                                        onClick={(e) => {
                                                                            if (item.id) {
                                                                                setOrderId(item.id);
                                                                                handleSubmitOrder(item.id);
                                                                            }
                                                                        }}
                                                                        key={-1}
                                                                        value={"Huỷ đơn hàng"}>
                                                                        Hủy đơn hàng
                                                                    </p>
                                                                    </td> */}
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
