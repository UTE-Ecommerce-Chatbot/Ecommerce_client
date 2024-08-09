import "App.css";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getProductList } from "actions/services/ProductServices";
import ProductSkeleton from "components/Item/ProductSkeleton";

const SearchPage = ({ onSelectProduct, onClosePopup, categoryCode }) => {
  const params = new URLSearchParams(window.location.search);
  const [loading, setLoading] = useState(true);
  const page = params.get("page");
  const [searchResults, setSearchResults] = useState([]);
  const [keyword, setKeyword] = useState("");

  const getProduct = async (id) => {
    try {
      const response = await axios.get(`/api/product/san-pham/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const handleSearch = () => {
    let searchObject = {};
    searchObject.keyword = keyword ? keyword : "";
    searchObject.page = page ? parseInt(page) : 1;
    searchObject.category = categoryCode;
    console.log(keyword);
    getProductList(categoryCode, searchObject)
      .then((res) => {
        setSearchResults(res.data.content.slice(0, 2));
        setLoading(false); // Đánh dấu tìm kiếm đã hoàn thành
      })
      .catch((err) => console.log(err));
  };

  const handleSelectProduct = async (product) => {
    var productdetail = await getProduct(product.id);
    console.log(productdetail);
    // var productfDetail = getProductById(product.id)
    onSelectProduct(productdetail); // Chuyển dữ liệu sản phẩm về trang CompareProduct
    onClosePopup();
  };
  const handleChange = (e) => {
    setKeyword(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "enter") {
      handleSearch();
    }
  };

  return (
    <div className="body-popup">
      <div className="search-popup">Tìm kiếm sản phẩm so sánh</div>
      <div className="search-container">
        <div className="wrap">
          <div className="search">
            <input
              type="text"
              className="searchTerm"
              placeholder="Nhập thông tin tìm kiếm"
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
            <button
              type="submit"
              className="searchButton"
              onClick={handleSearch}
            >
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="line-popup"></div>
      <div className="popup-list-product">
        {loading ? (
          <ProductSkeleton />
        ) : searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div key={product.id}>
              <Link
                onClick={() => {
                  handleSelectProduct(product);
                }}
                className="home-product-item-link"
              >
                <div className="popup-product-item">
                  <div
                    className="popup-product-item__img"
                    style={{ backgroundImage: `url(${product.mainImage})` }}
                  />
                  <h4 className="home-product-item__name">{product.name}</h4>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="no-results">Không có kết quả</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
