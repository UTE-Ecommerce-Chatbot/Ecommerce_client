import React from "react";
import { Link } from "react-router-dom";
import { currency } from "../../utils/FormatCurrency";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductTopSale(props) {
    const { products } = props;

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 6, // Hiển thị tối đa 6 sản phẩm trên một slide
        slidesToScroll: 6,
        centerMode: false,
        focusOnSelect: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 6,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              initialSlide: 1,
            },
          },
        ],
        appendDots: (dots) => (
          <div className="slick-dots-container">
            <ul style={{ margin: "50px" }}> {dots} </ul>
          </div>
        ),
        customPaging: (i) => <div className="slick-dot">{i + 1}</div>,
      };

    return (
        <>
        <Slider {...settings}>
            {products?.map((item) => {
                const price = currency(item.price);
                return (
                    <div className="col" key={item.slug}>
                        <Link to={`/san-pham/${item?.id}/${item.slug}`} className="home-product-item-link">
                            <div className="home-product-item">
                                <div
                                    className="home-product-item__img"
                                    style={{
                                        backgroundImage: `url(${item.mainImage})`,
                                    }}
                                />
                                <h4 className="home-product-item__name">{item.name}</h4>
                                <div className="home-product-item-price">
                                    <span className="home-product-item-price-new">{price}</span>
                                    <span className="home-product-item-seller">Đã bán {item.seller_count}</span>
                                </div>
                                <div className="home-product-item__info">
                                    <span className="home-product-item__brand">
                                        {item?.brandName}
                                    </span>
                                    <span className="home-product-item__brand-name">
                                        {item?.brandMadeIn}
                                    </span>
                                </div>
                                <div className="home-product-item__favourite">
                                    <i className="fas fa-check" />
                                    <span>Yêu thích</span>
                                </div>
                                <div className="home-product-item__sales">
                                    <span className="home-product-item__sales-percent">{item.percent_discount}%</span>
                                    <span className="home-product-item__sales-label">GIẢM</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </Slider>
        </>
    );
}
export default ProductTopSale;
