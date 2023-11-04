import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import SearchPage from './SearchPopup';
const CompareProduct = () => {
  const location = useLocation();
  const product1 = location.state?.product;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct1, setSelectedProduct1] = useState(null);
  const [selectedProduct2, setSelectedProduct2] = useState(null);
  const [selectedProduct3, setSelectedProduct3] = useState(null);
  console.log(product1);
  console.log("1111111111111111111111111")

  const handleSelectProduct = (product2) => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(product1));
    setIsPopupOpen(false);
  };
  
  
  const handleAddProductClick = () => {
    setSelectedProduct1(product1);
    setIsPopupOpen(true); // Khi click vào "Thêm sản phẩm", mở popup
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false); // Khi click vào "Thêm sản phẩm", đóng popup
  };

  // if (!selectedProduct3) {
  //   return <div>No product data available selectedProduct2.</div>;
  // }
  return (
    <div className="row sm-gutter section__item">
        <div className="col l-12 m-12 c-12">
            <div className="home-product-category-item">
                <h3 className="home-product-title">
                    So sánh sản phẩm
                </h3>
            </div>
        </div>
        <div className='image-product'>
            <div className='selectedProduct3'>
            <div className="col l-2 m-2 c-6" key={selectedProduct3.id}>
            <Link to={`/san-pham/${selectedProduct3.id}/${selectedProduct3.slug}`} className="home-product-item-link">
              <div className="compare-product-item">
                <div
                  className="compare-product-item__img"
                  style={{ backgroundImage: `url(${selectedProduct3.mainImage})`,
                }}
                />
                <h4 className="home-product-item__name">{selectedProduct3.name}</h4>
               
                
                <div className="home-product-item__favourite">
                  <i className="fas fa-check" />
                  <span>Yêu thích</span>
                </div>
                <div className="home-product-item__sales">
                  <span className="home-product-item__sales-percent">{selectedProduct3.percent_discount}%</span>
                  <span className="home-product-item__sales-label">GIẢM</span>
                </div>
              </div>
            </Link>
          </div>
            </div>
            <div className='line-image'></div>
            <div className='product2'>
            {selectedProduct2 && (
                    <div className="col l-2 m-2 c-6">
                        <div className="home-product-item-link">
                            <div className="compare-product-item">
                                <div
                                    className="compare-product-item__img"
                                    style={{ backgroundImage: `url(${selectedProduct2.mainImage})`,
                                }}
                                />
                                <h4 className="home-product-item__name">{selectedProduct2.name}</h4>
                                
                                <div className="home-product-item__favourite">
                                    <i className="fas fa-check" />
                                    <span>Yêu thích</span>
                                </div>
                                <div className="home-product-item__sales">
                                    <span className="home-product-item__sales-percent">{selectedProduct2.percent_discount}%</span>
                                    <span className="home-product-item__sales-label">GIẢM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {selectedProduct3 && <div class="addsp-cp" onClick={handleAddProductClick}>
                            <div class="plus">
                                <i class="fas fa-plus"></i>
                            </div>
                            <di><span>Thêm sản phẩm</span></di>
                        </div>
            }
            </div>
            {isPopupOpen && (
        <div className="overlay">
          <div className="popup">
          <button className="close" onClick={() => setIsPopupOpen(false)}>Đóng</button>
          <SearchPage onSelectProduct={handleSelectProduct} onClosePopup={handleClosePopup} />
          </div>
        </div>
        
      )}
        </div>
        <div className='line'></div>
        <div className="col l-12 m-12 c-12">
            <div className="group">
                <div className="content has-table-compare">
                    <table>
                        <tbody>
                        <tr>
                            <td>Tên sản phẩm</td>
                            <td>{selectedProduct3.name}</td>
                            <td>{selectedProduct3.name}</td>
                        </tr>
                        <tr> 
                            <td>Thương hiệu</td>
                            <td>{selectedProduct3?.brand?.name}</td>
                            <td>{selectedProduct3?.brand?.name}</td>
                        </tr>
                        <tr>
                            <td>Xuất xứ thương hiệu</td>
                            <td>{selectedProduct3?.brand?.madeIn}</td>
                            <td>{selectedProduct3?.brand?.madeIn}</td>
                        </tr>
                        {selectedProduct3?.product_specs?.map((item, index) => {
                            return (<tr key={index}>
                                    <td>{item.attributeName}</td>
                                    <td>{item.attributeValue}</td>
                                    <td>{item.attributeValue}</td>
                                </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
};
export default CompareProduct;
