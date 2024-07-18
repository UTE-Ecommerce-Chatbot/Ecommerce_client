import React, { useCallback, useEffect, useState, useRef } from "react";
import Slide from "components/Slide/Slide";
// import Promotion from "components/Promotion/Promotion";
import Category from "components/CategoryHighlights/Category";
import * as services from "actions/services/ProductServices";
import useTimeout from "hooks/useTimeout";
import ProductItem from "components/Item/ProductItem";
import ProductItemSkeleton from "components/Item/ProductItemSkeleton";
import ProductTopSale from "components/Item/ProductTopSale";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "actions/services/UserActions";
import { getListRecommendForUser } from "actions/services/RecommendServices";
import { getOneCategoryByCode } from "actions/services/CategoryActions";

function HomePage(props) {
  const [products, setProducts] = useState([]);
  const [topSale, setTopSale] = useState([]);
  const [mostPopularProduct, setMostPopularProduct] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const getUser = useCallback(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleChangePage = (page) => {
    setPage(page + 1);
  };

  const getNewData = useCallback(() => {
    let searchObject = {
      page: page,
      limit: 24,
      keyword: "",
    };
    services
      .getProductList(searchObject)
      .then((res) => {
        setProducts([...products, ...res.data.content]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const getTopSaleProduct = () => {
    services
      .topSaleProduct()
      .then((res) => {
        setTopSale(res.data.content);
      })
      .catch((err) => console.log(err));
  };

  const getPopularProduct = useCallback(() => {
    services
      .getListProductMostPopular()
      .then((res) => setMostPopularProduct(res.data))
      .catch(() => setMostPopularProduct([]));
  }, []);

  useEffect(() => {
    document.title = "Mua hàng online giá tốt, hàng chuẩn, ship nhanh";
    getNewData();
    getTopSaleProduct();
    getPopularProduct();
  }, [getNewData, getPopularProduct]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user) {
      getListRecommendForUser()
        .then((res) => {
          setRecommendList(res);
        })
        .catch(() => setRecommendList([]));
    }
  }, [user]);

  useTimeout(() => setLoading(false), loading ? 1000 : null);

  const [isRinging, setIsRinging] = useState(false);

  const ringBell = () => {
    setIsRinging(true);

    // Ngắt hiệu ứng sau một khoảng thời gian nhất định
    setTimeout(() => {
      setIsRinging(false);
    }, 1000); // Thời gian rung chuông (ms)
  };

  useEffect(() => {
    ringBell(); // Gọi hàm khi component được render lần đầu
  }, []);
  //   --------------
  const [category, setCategory] = useState([]);
  useEffect(() => {
    getOneCategoryByCode()
      .then((res) => {
        setCategory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const hasRecommendList = recommendList?.length > 0;
  const hasProducts = products?.length > 0;
  const hasTopSale = topSale?.length > 0;
  const hasMostPopularProduct = mostPopularProduct?.length > 0;
  return (
    <>
      <div className="navigation">
        <div className="grid wide">
          <div className="row">
            <div className="col l-12 m-12 c-12">
              <div className="content">
                <div className="nav">
                  <div className="slider-bar">
                    <span className="products">
                      <Link to="/dien-thoai" className="list">
                        <div className="product">Điện thoại</div>
                      </Link>
                      <Link to="/may-tinh-bang" className="list">
                        <div className="product">Máy tính bảng</div>
                      </Link>
                      <Link to="/laptop" className="list">
                        <div className="product">Laptop</div>
                      </Link>
                      <Link to="/" className="list">
                        <div className="product">Điện tử</div>
                      </Link>
                      <Link to="/" className="list">
                        <div className="product">Máy ảnh</div>
                      </Link>
                      <Link to="/" className="list">
                        <div className="product">Smartphone</div>
                      </Link>
                      <Link to="/" className="list">
                        <div className="product">Phụ kiện Laptop</div>
                      </Link>
                      <Link to="/" className="list">
                        <div className="product">Phụ kiện điện thoại</div>
                      </Link>
                      <Link to="/" className="list">
                        <div className="product">Máy giặt Inverter</div>
                      </Link>
                      <Link to="/tivi" className="list">
                        <div className="product">Smart TV</div>
                      </Link>
                      <Link to="/" className="list">
                        <div className="product">Inverter TV</div>
                      </Link>
                      <Link to="/" className="list">
                        <div className="product">Thiết bị số</div>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Slide />
      {/* <Promotion /> */}

      {/* <div className="row sm-gutter section__content">
        <div className="col l-12 m-12 c-12">
          <div className="home-product">
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">Xu Hướng Mua Sắm</h3>
                </div>
              </div>
              <div className="col l-12 m-12 c-12">
                <div className="trend-list">
                  <a href="/" className="trends__item-container">
                    <div className="trends__box">
                      <div className="title">Điện thoại Smartphone</div>
                      <div className="sub-title">Giảm đến 25%</div>
                      <div className="trends__img-box">
                        <picture className="trends__img-container">
                          <img
                            src="https://salt.tikicdn.com/cache/w100/ts/product/48/22/7c/0ddf107a81ccf15f9e2d27ba67e25d6b.jpg.webp"
                            alt=""
                            className="trends__img"
                          />
                        </picture>
                        <picture className="trends__img-container">
                          <img
                            src="https://salt.tikicdn.com/cache/w100/ts/product/ac/e0/57/6f377a45a456cda76c40bbd79b64a0a3.png.webp"
                            alt=""
                            className="trends__img"
                          />
                        </picture>
                      </div>
                    </div>
                  </a>
                  <a href="/" className="trends__item-container">
                    <div className="trends__box">
                      <div className="title">Laptop</div>
                      <div className="sub-title">Giảm đến 29%</div>
                      <div className="trends__img-box">
                        <picture className="trends__img-container">
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/datn-ecommerce.appspot.com/o/images%2Fproduct%2F1633964583279_hpprobook-1.jpg?alt=media&token=2e863728-f0af-420e-92d7-c198ebe810ab"
                            alt=""
                            className="trends__img"
                          />
                        </picture>
                        <picture className="trends__img-container">
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/datn-ecommerce.appspot.com/o/images%2Fproduct%2F1633964870944_hp-gaming-1.png?alt=media&token=faa23b81-07db-440f-8988-aa6f4c8207f6"
                            alt=""
                            className="trends__img"
                          />
                        </picture>
                      </div>
                    </div>
                  </a>
                  <a href="/" className="trends__item-container">
                    <div className="trends__box">
                      <div className="title">Smart TV</div>
                      <div className="sub-title">Giảm đến 15%</div>
                      <div className="trends__img-box">
                        <picture className="trends__img-container">
                          <img
                            src="https://salt.tikicdn.com/cache/200x200/media/catalog/producttmp/01/de/fd/0c4c0ba101d2e003f9d150827a50b85a.jpg.webp"
                            alt=""
                            className="trends__img"
                          />
                        </picture>
                        <picture className="trends__img-container">
                          <img
                            src="https://salt.tikicdn.com/cache/200x200/ts/product/3d/e0/b3/6ad732324e4f786bd19d234cb232fbfa.jpg.webp"
                            alt=""
                            className="trends__img"
                          />
                        </picture>
                      </div>
                    </div>
                  </a>
                  <a href="/" className="trends__item-container">
                    <div className="trends__box">
                      <div className="title">Thiết bị phụ kiện</div>
                      <div className="sub-title">Giảm đến 20%</div>
                      <div className="trends__img-box">
                        <picture className="trends__img-container">
                          <img
                            src="https://salt.tikicdn.com/cache/200x200/ts/product/58/84/f4/abc897dcc4dfc6a69f3c216cf9358c20.png.webp"
                            alt=""
                            className="trends__img"
                          />
                        </picture>
                        <picture className="trends__img-container">
                          <img
                            src="https://salt.tikicdn.com/cache/200x200/ts/product/87/5e/c4/e648b0853ff786c20ab61c9b7137921e.jpg.webp"
                            alt=""
                            className="trends__img"
                          />
                        </picture>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <Category />
      <div className="row sm-gutter section__content">
        <div className="col l-12 m-12 c-12">
          <div className="home-product">
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">Sản phẩm bán chạy nhất</h3>
                </div>
              </div>
              {loading ? (
                <ProductItemSkeleton total={products.length} />
              ) : (
<>
                {hasTopSale? (
                  <ProductTopSale products={topSale} />
                ) : (
                  <div className="no-products">
                    {/* Không có sản phẩm tương tự */}
                  </div>
                )}
              </>
              )}
            </div>
          </div>
        </div>
        <div className="col l-12 m-12 c-12">
          <div className="home-product">
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">Sản phẩm phổ biến nhất</h3>
                </div>
              </div>
              {loading ? (
                <ProductItemSkeleton total={mostPopularProduct.length} />
              ) : (
<>
                {hasMostPopularProduct ? (
                  <ProductTopSale products={mostPopularProduct} />
                ) : (
                  <div className="no-products">
                    {/* Không có sản phẩm tương tự */}
                  </div>
                )}
              </>
              )}
            </div>
          </div>
        </div>
        <div className="col l-12 m-12 c-12">
          <div className="home-product">
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">Sản phẩm mới nhất</h3>
                </div>
              </div>
              {loading ? (
                <ProductItemSkeleton total={products.length} />
              ) : (
                <>
                {hasProducts ? (
                  <ProductItem products={products} />
                ) : (
                  <div className="no-products">
                    {/* Không có sản phẩm tương tự */}
                  </div>
                )}
              </>
              )}
              <div className="col l-12 m-12 c-12">
                <div className="section-center">
                  {page <= 3 ? (
                    <button
                      className="home-product-viewmore"
                      onClick={() => handleChangePage(page)}
                    >
                      Xem thêm
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {user?.username ? (
          <div className="col l-12 m-12 c-12">
            <div className="home-product">
              <div className="row sm-gutter section__item">
                <div className="col l-12 m-12 c-12">
                  <div className="home-product-category-item">
                    <h3 className="home-product-title">
                      Sản phẩm dành cho bạn
                    </h3>
                  </div>
                </div>
                {loading ? (
                  <ProductItemSkeleton total={products.length} />
                ) : (
                  <>
                    {hasRecommendList ? (
                      <ProductItem products={recommendList} />
                    ) : (
                      <div className="no-products">
                        {/* Không có sản phẩm tương tự */}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* ---------chat-------- */}

      {/* <div className="chat" onClick={toggleChat}>
        <img src={chatIcon} alt="Message" />
      </div>
      <div id="chat-box">{chatContent}</div>*/}
      {/* {isChatBoxVisible && (
        <div className="chat-box">
          <div className="chat-header">
            <span>Chat now</span>
            <button onClick={toggleChat}>--</button>
          </div>
          <div
            className="chat-body"
            ref={messageAreaRef}
            style={{ overflowY: "scroll", maxHeight: "300px" }}
          >
            <div class="connecting">
              <img src={avatar} alt="Avatar" className="avatar" />
              <div className="message-text">
                Xin chào! Tôi rất vui khi được hỗ trợ bạn.
              </div>
            </div>
            <ul id="messageArea">
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={
                    message.sender === currentUser
                      ? "sent-message"
                      : "received-message"
                  }
                >
                  <div className="message-container">
                    {message.sender === currentUser && (
                      <div className="sender-message">
                        <img
                          src={avatar}
                          alt="Avatar"
                          className="avatar-sender"
                        />
                        <div className="message-text-sender">
                          {"Xin chào! Tôi rất vui khi được hỗ trợ bạn."}
                        </div>
                      </div>
                    )}
                    {message.sender === currentUser && (
                      <div className="receiver-message">
                        <img
                          src={avatar}
                          alt="Receiver Avatar"
                          className="avatar"
                        />
                        <div className="message-text">
                          {"Xin chào! Tôi rất vui khi được hỗ trợ bạn."}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )} */}
    </>
  );
}

export default HomePage;
