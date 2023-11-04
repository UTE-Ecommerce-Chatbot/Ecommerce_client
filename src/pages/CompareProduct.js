import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import SearchPage from "./SearchPopup";
const CompareProduct = () => {
  const location = useLocation();
  const product = location.state?.product;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [products, setProducts] = useState([product]);

  const handleSelectProduct = (product) => {
    setProducts([...products, product]);
    setIsPopupOpen(false);
  };

  const handleAddProductClick = () => {
    setIsPopupOpen(true); // Khi click vào "Thêm sản phẩm", mở popup
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false); // Khi click vào "Thêm sản phẩm", đóng popup\
  };
  const product1 = products[0];
  var product2 = products[1];
  // console.log(product1);
  // console.log(product2);

  const handleDeleteProduct = () => {
    const productsCopy = [...products];
    productsCopy.splice(1, 1);
    setProducts(productsCopy);
  };

  return (
    <div className="row sm-gutter section__item">
      <div className="col l-12 m-12 c-12">
        <div className="home-product-category-item">
          <h3 className="home-product-title">So sánh sản phẩm</h3>
        </div>
      </div>
      <div className="image-product">
        <div className="product1">
          <div className="col l-2 m-2 c-6" key={product1.id}>
            <Link
              to={`/san-pham/${product1.id}/${product1.slug}`}
              className="home-product-item-link"
            >
              <div className="compare-product-item">
                <div
                  className="compare-product-item__img"
                  style={{ backgroundImage: `url(${product1.mainImage})` }}
                />
                <h4 className="home-product-item__name">{product1.name}</h4>

                <div className="home-product-item__favourite">
                  <i className="fas fa-check" />
                  <span>Yêu thích</span>
                </div>
                <div className="home-product-item__sales">
                  <span className="home-product-item__sales-percent">
                    {product1.percent_discount}%
                  </span>
                  <span className="home-product-item__sales-label">GIẢM</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="line-image"></div>
        <div className="product2">
          <div className="product-add">
          {product2 && (
            <div className="">
              <div className="remove-product" onClick={handleDeleteProduct}>
              <div className="minus">
                <i className="fas fa-minus"></i>
              </div>
              <di>
                <span>Xoá sản phẩm</span>
              </di>
            </div>
              <Link
                to={`/san-pham/${product2.id}/${product2.slug}`}
                className="home-product-item-link"
              >
                <div className="home-product-item-link">
                  <div className="compare-product-item">
                    <div
                      className="compare-product-item__img"
                      style={{ backgroundImage: `url(${product2.mainImage})` }}
                    />
                    <h4 className="home-product-item__name">{product2.name}</h4>

                    <div className="home-product-item__favourite">
                      <i className="fas fa-check" />
                      <span>Yêu thích</span>
                    </div>
                    <div className="home-product-item__sales">
                      <span className="home-product-item__sales-percent">
                        {product2.percent_discount}%
                      </span>
                      <span className="home-product-item__sales-label">
                        GIẢM
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
          {!product2 && (
            <div className="addsp-cp" onClick={handleAddProductClick}>
              <div className="plus">
                <i className="fas fa-plus"></i>
              </div>
              <di>
                <span>Thêm sản phẩm</span>
              </di>
            </div>
          )}
          
        </div>
        {isPopupOpen && (
          <div className="overlay">
            <div className="popup">
              <button className="close" onClick={() => setIsPopupOpen(false)}>
                Đóng
              </button>
              <SearchPage
                onSelectProduct={handleSelectProduct}
                onClosePopup={handleClosePopup}
              />
            </div>
          </div>
        )}
        </div>
      </div>
      <div className="line"></div>
      <div className="col l-12 m-12 c-12">
        <div className="group">
          <div className="content has-table-compare">
            <table>
              <tbody>
                <tr>
                  <td className="name">Tên sản phẩm</td>
                  <td className="value1">{product1.name}</td>
                  <td className="value2">{product2?.name}</td>
                </tr>
                <tr>
                  <td className="name">Thương hiệu</td>
                  <td className="value1">{product1?.brand?.name}</td>
                  <td className="value2">{product2?.brand?.name}</td>
                </tr>
                <tr>
                  <td className="name">Xuất xứ thương hiệu</td>
                  <td className="value1">{product1?.brand?.madeIn}</td>
                  <td className="value2">{product2?.brand?.madeIn}</td>
                </tr>

                {product1?.product_specs?.map((item, index) => {
                  if (product2 && product2.product_specs) {
                    const item2 = product2.product_specs.find(
                      (item2) => item2.attributeName === item.attributeName
                    );
                    return (
                      <tr key={index}>
                        <td className="name">{item.attributeName}</td>
                        <td className="value1">{item.attributeValue}</td>
                        <td className="value2">{item2?.attributeValue}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={index}>
                        <td className="name">{item.attributeName}</td>
                        <td className="value1">{item.attributeValue}</td>
                        <td></td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompareProduct;
