import React from "react";
import { Link } from "react-router-dom";
import { currency } from "../../utils/FormatCurrency";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
function ProductItem(props) {
  let { products } = props;

  if (products?.length === 0 || products === undefined) {
    products = [];
  }

  // Convert the products variable to an array before calling the map() method
  const productsArray = Array.from(products);

  return (
    <>
      {productsArray?.map((item) => {
        const price = currency(item.price);
        return (
          <div className="col l-2 m-2 c-6" key={item.id}>
            <Link
              to={`/san-pham/${item.id}/${item.slug}`}
              className="home-product-item-link"
            >
              <div className="home-product-item">
                <div
                  className="home-product-item__img"
                  style={{ backgroundImage: `url(${item.mainImage})` }}
                />
                <h4 className="home-product-item__name">{item.name}</h4>
                <div className="home-product-item-price">
                  <span className="home-product-item-price-new">{price}</span>
                  <span className="home-product-item-seller">
                    Đã bán {item.seller_count}
                  </span>
                </div>
                <div className="home-product-item__info">
                  <span className="home-product-item__brand">
                    {item.brand ? item.brand.name : ""}
                  </span>
                  <span className="home-product-item__brand-name">
                    {item.brand ? item.brand.madeIn : ""}
                  </span>
                </div>
                <div className="home-product-item__favourite">
                  <i className="fas fa-check" />
                  <span>Yêu thích</span>
                </div>
                <div className="home-product-item__sales">
                  <span className="home-product-item__sales-percent">
                    {item.percent_discount}%
                  </span>
                  <span className="home-product-item__sales-label">GIẢM</span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
}

export default ProductItem;

// import styles from "./ProductItem.module.css";

// function ProductItem(props) {
//   let { products } = props;

//   if (products?.length === 0 || products === undefined) {
//     products = [];
//   }
//   const productsArray = Array.from(products);

//   return (
//     <>
//       <Carousel
//         showArrows={true}
//         infiniteLoop
//         autoPlay={false}
//         centerMode={true}
//         itemsToShow={6}
//         showStatus={false}
//         showThumbs={false} // Hide thumbnails
//       >
//         {productsArray.map((item) => {
//           const price = currency(item.price);
//           return (
//             <div className={styles.carouselItem} key={item.id}>
//               <Link
//                 to={`/san-pham/${item.id}/${item.slug}`}
//                 className="home-product-item-link"
//               >
//                 <div className={styles.productItem}>
//                   <div
//                     className={styles.productItemImage}
//                     style={{ backgroundImage: `url(${item.mainImage})` }}
//                   />
//                   <h4 className={styles.productItemName}>{item.name}</h4>
//                   <div className={styles.productItemPrice}>
//                     <span className="home-product-item-price-new">{price}</span>
//                     <span className="home-product-item-seller">
//                       Đã bán {item.seller_count}
//                     </span>
//                   </div>
//                   <div className={styles.productItemInfo}>
//                     <span className="home-product-item__brand">
//                       {item.brand ? item.brand.name : ""}
//                     </span>
//                     <span className="home-product-item__brand-name">
//                       {item.brand ? item.brand.madeIn : ""}
//                     </span>
//                   </div>
//                   <div className={styles.productItemFavourite}>
//                     <i className="fas fa-check" />
//                     <span>Yêu thích</span>
//                   </div>
//                   <div className={styles.productItemSales}>
//                     <span className="home-product-item__sales-percent">
//                       {item.percent_discount}%
//                     </span>
//                     <span className="home-product-item__sales-label">GIẢM</span>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           );
//         })}
//       </Carousel>
//     </>
//   );
// }

// export default ProductItem;
