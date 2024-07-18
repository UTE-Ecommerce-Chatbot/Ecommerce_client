import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { currency } from "utils/FormatCurrency";
import { Link, useHistory } from "react-router-dom";
import {
  API_URL,
  DECREASE_IMG,
  INCREASE_IMG,
} from "actions/constants/constants";
import { getCurrentUser } from "actions/services/UserActions";
import {
  addViewedProduct,
  getListProductMostPopular,
  getListProductViewedByUser,
  getOneItem,
} from "actions/services/ProductServices";
import {
  addLikeProduct,
  deleteProductLiked,
  getProductLiked,
} from "actions/services/ProductServices";
import { getAllCommentByProductId } from "actions/services/CommentServices";
import {
  getListRecommendForUser,
  getSimilarProduct,
} from "actions/services/RecommendServices";
import { addProductToCart, getCartInfo } from "actions/services/CartActions";
import "react-toastify/dist/ReactToastify.css";
import useTimeout from "hooks/useTimeout";
import DetailProductSkeleton from "components/Loading/DetailProductSkeleton";
import DetailsThumbnail from "components/Item/DetailThumbnail";
import ProductItem from "components/Item/ProductItem";
import ProductItemSkeleton from "components/Item/ProductItemSkeleton";
import BrandProduct from "components/Brand/BrandProduct";
import { toast } from "react-toastify";

function DetailProduct(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { match } = props;
  console.log("match", match);
  const [product, setProduct] = useState({});
  console.log("const_product", product);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [index, setIndex] = useState(0);
  console.log("const_index", index);
  const [productLiked, setProductLiked] = useState(false);
  const [productViewed, setProductViewedd] = useState([]);
  const [mostPopularProduct, setMostPopularProduct] = useState([]);
  const [comments, setComments] = useState([]);
  const username = localStorage.getItem("username");
  const params = new URLSearchParams(window.location.search);
  console.log("params", params);
  const color = params.get("color") ? params.get("color") : "";
  const [similarProduct, setSimilarProduct] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  console.log("username", username);
  const getUser = useCallback(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const compareProduct = (product) => {
    history.push("/so-sanh-san-pham", { product });
  };

  const myRef = React.createRef();

  const handleTab = (index) => {
    console.log("index", index);
    setIndex(index);
    const images = myRef.current.children;
    for (let i = 0; i < images.length; i++) {
      images[i].className = images[i].className.replace("active", "");
    }
    images[index].className = "active";
  };

  const addQuery = (key, value) => {
    let pathname = window.location.pathname;
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    history.push({
      pathname: pathname,
      search: searchParams.toString(),
    });
  };

  const getComment = useCallback(() => {
    const id = match.params.id;
    getAllCommentByProductId(id)
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => alert(err));
  }, [match.params.id]);

  useEffect(() => {
    const id = match.params.id;
    console.log("id", id);
    console.log("color", color);
    getOneItem(id, color)
      .then((res) => {
        console.log("res.data", res.data);
        setProduct(res.data);
        const features = res.data?.features;

        const featuresArray = features ? features.split(",") : []; // Default to empty string if features is null or undefined

        getSimilarProduct(featuresArray, res.data?.category.code)
          .then((res) => setSimilarProduct(res.data))
          .catch((err) => console.log("Error similar: " + err));
      })
      .catch((err) => console.log(err));
    getComment();
    if (username) {
      addViewedProduct({ productId: id })
        .then(() => {})
        .catch(() => {});
      getListProductViewedByUser()
        .then((res) => {
          setProductViewedd(res);
        })
        .catch(() => setProductViewedd([]));
      getListRecommendForUser()
        .then((res) => {
          setRecommendList(res);
        })
        .catch(() => setRecommendList([]));
      getProductLiked(id)
        .then((res) => {
          if (res.data === true) {
            setProductLiked(true);
          }
        })
        .catch(() => setProductLiked(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, getComment, match.params.id, username]);

  useEffect(() => {
    if (
      myRef.current &&
      myRef.current.children &&
      myRef.current.children[index]
    ) {
      myRef.current.children[index].className = "active";
    }
  }, [index, myRef]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    getListProductMostPopular()
      .then((res) => setMostPopularProduct(res.data))
      .catch(() => setMostPopularProduct([]));
  }, [product]);

  useEffect(() => {
    document.title = product.name
      ? `${product?.name} | Tiki`
      : "Thông tin sản phẩm | Tiki";
  }, [product?.name]);

  useTimeout(() => setLoading(false), loading ? 1000 : null);

  const handleAddToCart = () => {
    if (username) {
      const data = {
        cart_details: [
          {
            product_id: product?.id,
            quantity,
            color: color,
          },
        ],
      };
      if (product?.in_stock > 0 && quantity <= product?.in_stock) {
        addProductToCart(data)
          .then((res) => {
            toast.info(res.message, {
              position: "bottom-center",
              theme: "dark",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            dispatch(getCartInfo());
          })
          .catch((err) => {
            toast.warning(err.response.data.message, {
              position: "bottom-center",
              theme: "dark",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      }
    } else {
      props.history.push("/login");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayComment = (numStar) => {
    let ratingStars = [];
    if (product) {
      for (let i = 0; i < 5; i++) {
        if (numStar === 5) {
          ratingStars.push(<i key={i} className="fas fa-star" />);
        } else {
          for (let j = 0; j < numStar; j++) {
            ratingStars.push(<i key={j} className="fas fa-star" />);
          }
          for (let k = numStar; k < 5; k++) {
            ratingStars.push(<i key={k} className="far fa-star" />);
          }
          break;
        }
      }
    }
    return ratingStars;
  };

  const displayStatusRating = (rating) => {
    let status = "";
    switch (rating) {
      case 5:
        status = "Cực kỳ hài lòng";
        break;
      case 4:
        status = "Hài lòng";
        break;
      case 3:
        status = "Bình thường";
        break;
      case 2:
        status = "Không hài lòng";
        break;
      case 1:
        status = "Rất không hài lòng";
        break;
      default:
        break;
    }
    return status;
  };

  const toggleLikeProduct = () => {
    if (username) {
      const data = {
        productId: product?.id,
      };
      if (productLiked) {
        deleteProductLiked(product?.id)
          .then(() => setProductLiked(false))
          .catch(() => alert("ERR"));
      } else {
        addLikeProduct(data)
          .then(() => setProductLiked(true))
          .catch(() => setProductLiked(false));
      }
    } else {
      props.history.push("/login");
    }
  };
  const hasSimilarProduct = similarProduct?.length > 0;
  const hasMostPopularProduct = mostPopularProduct?.length > 0;
  const hasRecommendList = recommendList?.length > 0;
  const hasProductViewed = productViewed?.length > 0;

  return (
    <>
      {!loading ? (
        <div className="row sm-gutter section__content">
          <div className="breadcrumb">
            <Link className="breadcrumb-item" to="/">
              Trang chủ
            </Link>
            <Link
              className="breadcrumb-item"
              to={`/${product?.category?.code}`}
            >
              {product?.category?.name}
            </Link>
            <Link
              className="breadcrumb-item"
              to={`/${product?.category?.code}/${product?.subcategory?.code}`}
            >
              {product?.subcategory?.name}
            </Link>
            <span className="breadcrumb-item">
              <span>{product.name}</span>
            </span>
          </div>
          <div className="col l-12 m-12 c-12">
            {/* <div className="product-info"> */}
            {/* ------   Grid -> Row -> Column  ------ */}
            <div className="row sm-gutter section__item">
              <div className="col l-5 m-4 c-12">
                <div className="left-thumbnail">
                  {
                    <img
                      src={`${product?.images?.[index]}`}
                      alt=""
                      style={{
                        width: "444px",
                        height: "444px",
                        objectFit: "contain",
                      }}
                    />
                  }
                  <div className="list-img">
                    <DetailsThumbnail
                      images={product?.images ?? []}
                      tab={handleTab}
                      myRef={myRef}
                    />
                  </div>
                  <div className="left-bottom">
                    <div className="share">
                      <p>Chia sẻ:</p>
                      <div className="share-social">
                        <img
                          src="data:image/png;base64,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"
                          alt="social-facebook"
                        />
                        <img
                          src="data:image/png;base64,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"
                          alt="social-messenger"
                        />
                        <img
                          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDw4PDxAPDw8NDw0PDw8PDQ8NDw8PFREWFhUVFRUYHSggGBolHRUVITIiJSktMC4uFx8zODMsNygtMCsBCgoKDg0OFxAQFy0dHR0tLS0tLS0tLS4tLS0tLS0tKy0vLS0tLS0rLS0tLS0tKy0tLS0tKy0tLSstKystLS0uLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAQIDBgcFBAj/xABAEAACAQIBCQQHBAoCAwAAAAAAAQIDEQQFBhIhMUFRYXETgZGhBxQiMkJSYiNyscEVM1NzgpKistHSNENjwvH/xAAbAQACAwEBAQAAAAAAAAAAAAAABAIDBQEGB//EADMRAAICAAMECQQBBAMAAAAAAAABAgMEERIFITFBE1FhcYGRocHRIjKx8OEUNEJyFSNi/9oADAMBAAIRAxEAPwDuIAAAAAAAAAAPlxmNpUIOdWcaceMntfBLe+SNPytnu9ccNCy/a1Fd/wAMN3f4ElFvgMYfC23v6F48vM3TEV4U4uU5RhFbZSkopd7PBx2d+Fp3UXOrJfJG0f5pW8rnPcZjqlaWlVnOpLjKd7dFsXcYLk+jZtU7GrW+2TfYty+X6G3YrPitL9VTpwX1KVSX5LyPJr5yYye3ESXKFoW/lseRcXIus068Jh6/trXln6vefbVyjXl71WrL71acvxZgc29rb6u5juTcrdYyslwRkUz6aOPqw9ypUj92rOP4M+O4TK5VnXGL4ns0M4MVDZXqfxPtP7kz08LnjWj78adRfdcJeK1eRqqkWUipqS4MXswVE/ugvLL8bzoGDzuw87KanTfNaUfFa/I93D4mnUWlTnGceMJKS8jkikZ6GJlBqUJShJb4ycX5ArpR4rMzLti1tZ1ycX5r59WdbBpGTM7qkbRrx7SPzxtGp4bH5G2YHH0q8dKlNSW9XtKPVbUXQsjLgYuIwdtH3rd1rh+959YALBUAAAAAAAAAAAAAAAAAaxnDnXTw2lTp2q11qav9nB/U1tfJd9jyM6s7W9KhhZWWtTrReuXFU3w+rw4mltjdWGb3yNjB7Ozyndw6vn45n14/KFXET7SrOUnuvsiuEVsS6HzFbi410ZuRySSW5Itcm5S5NzjrJai9xcpcXIOslqL3JuY7k3IOs7qMlyyZiuTcqlWTUjLcJmNMvcplWTUjIpFlIxXCZRKs7xPoUjPhsTOnJTpycJLY4uz/APnI+RSLKQtKojKKa3m95EzpjUtTr2hPUlPZCXX5X5dDaDj6kbJm7nHKlanWblS2KW2VL/MeW7dwJ13Nbp+ZgY7ZX+dK8Pj48uo3wGOnUUkpRaakk007pp7GjINGAAAAAAAAAAADn2eec+k5YbDy9jXGrUi/fe+EX8vF79mzb6WfGcHq8OwpStWqx9qS20qb/CT3cNb4HNrmlg8LqXSS8Pk1cBhU8rZ+Hz8FhcrcXNLozZ1Fri5W4uc6MNRa5Nylxc50Z3UXuWuY7k3IuslqL3LXMdxcqdZ1SMtwmUuTcqlWT1F7kplEyblMqyakXTLpmK5NyiVZYpGVMsmY0yUxeVZNMyxkZFI+dMvGQtOs61mbPmzl50JKlVd6Mntf/U3vX08V39d9i761rT2M5BGRuGZ2WtmGqPZ+qk3/AEf48OByqWl6X4GBtXAZp3QW/muvt+evj37iABk88AAAA+DLGUYYahUrT2QWqO+UnqjFdXY+85n6Rsr9pWjhoP2aHtTtsdWSf4Rf9TGcJh3faocuL7v3cX4erpbFHlz7jV8di51qk6s3pSnKUpPnwXJKyXJGG5j0hc9Qq8uB6DPLgWuTcpcXO9GGotctcpci4dGGovcm5juLkejO6jLcXMdy1yDrJKRdMm5juWuVOslqL3JuY7kplUqySkZUybmNMlMplWWKRlTCZRMlMolWWKRkTLJmNMlMXnWWKRlTJTMaZdMVlAsjIyRZlp1Gmmm04tNNammtjR86ZdMVnAlxOpZAymsTQjPVpr2KiW6a39Ht7z1Dm+aGUuxxEYt2p17U3wUvgfi7d7OkE4SzW/ieN2hhf6e5pfa96+PAAAmInx5UxkcPRq1pbKUJTtxaWpdW7LvOH4ivKpOdSbvKcpTk+MpO782dI9J2P0MNTop669S8lxp07N/1OBzC56bY2Hyqdj/yfov5z8jUwMdMHLr9v5L3FytyDZ0DmotcXKA7oRzUXuTcxknNCO6i1yblLk3OdGGotcm5juW18CDr7CakXuSmY7k3KpVklIzXJuYrkplMqyakZEy1yiZKZRKBNMvcsmY0yUxeUCyMjImWTKJmzZBzQq4iPaVJdjTeuF4XlNcVG6sub8BW3TBZsJ3wqjqm8ka8mXTPVzhyBUwbi3JVKVS6jNR0WpL4ZLc/8M8dMWaUlmi6m6NkVKDzTMiZKZVMsmLTgMxZkjI6nkDG+sYalUbvKyjP78dT8dvecpTNz9HuM11qD4KrFdLRl/6lCWmRmbYp6TD61xhv8Hufs/A3YAEjyhyf0lYvTxqp31UKVONuEpXm/Jx8DVT086K3aY7Fy/8APVj3QloLyieYe6wlfR0Qj1JeeWb9TVremEV2AEAYJOZJFgSBHWAAB3WC1CjKpKMIRcpzkoxitblJ7Eip0P0b5CsnjKi1y0oYdNbI7JT79i5X4i2MxKw9TsfgutkZ3aIts+rIOYlGnGM8Uu2qtJuF70YPhZe8+b1cjZP0LhLaPquG0fl9WpW8LHog8dbirrZapzb/AAu5cjOnZKbzbNQy9mNh60XLDpUKu5LVSlycfh6x8Gc2yjk+rhqjpVYOEo7nskuMXsa5neDzcsZIo4un2daGktsZJ2nTlxi9z/HeO4PatlT02/VH1Xz3PwyGKcXKG6W9epxBMm57ecua9fBS0v1lFu0asVs4Ka+F+T8jwkz0kJQtipweaZqwsUlmnmjImWTMaZKZXKstTMiZnw9GVSUYU4uUpu0YxV22fTkTI1bF1NClHUrac5aqdNc3vfJazqOQs36ODhaC06jXt1ZJacuS+WPJeZl4zEQo3cZdXz+5lN+MjSsuMur5PIzazPjR0auJUalXU40/ep03xfzS8l5m4g8vODKkcJh51XZy92nF/HUexdN75JmFKU7Zb97ZjTssvms97fD+DV/SLlOLdPCxs3CSqzfyvRaUetpN96NKTFatKpOU5tylOTlKT2tt3bKpmlGnRFRPT4WpU1qC5fnn+9RkTLJmNMsmUTgORZlTPYzUxPZ4yi905dm+en7K82jxEzPhquhOnNbYSjJdYtP8hScSVkekrlDrTXnuOzAp2seKIKzwm84PjaulVqy+epUl4yb/ADMBIPoKWSHnIAA6R1gAAc1gCxZRbaSTbbSSSu23sSQHdZ6ea+RpY3Ewp61TXt1pL4aa22fF7F1vuO0UaUYRjCKUYwSjGKVkopWSR4uZ+RFg8MoyS7aradZ7bStqh0itXW73nvnjtp4v+otyj9sdy7et/HYL2T1PsAAM4rAAADHUpRlFxklKMk1KMkpJp7U09qOd51ZjOOlWwSclrcqG2Uf3fFfTt4X2HSAMYbFWYeWqD71yff8AuZZXbKt5xPz7Zq6as1dNPVZrbc2vNbM+pidGrW0qVDat1SqvpT2R+p93E6TVyXhpy054ehOpt05Uacp36tXPuNTEbZc4ZVx0vm888u75fkNTxsnHKKyPlwWDp0IRp0oRhCOyMVbv5vmfUAYjebzYi3nvZDZybO/LfrddqD+wo3hT4S+affu5JczaPSBlvsaXq0H9piIvTaeuFHY++WtdEzm6NfZ+F+npZc+Hz7eZrbOpy/7H4e79vMumWTMaZZMbnE2FIyJlkY0y6YpOJdGRdMujGmWTE7Il0ZG0fpuXEGtaXMgo0CX/AB1R5laGjKUfllKPg7FT78v0dDF4qHy4ivbo5tryaPgPdQecU+tI8s5gEgkR1ggkAR1kG6ejrIPaT9bqL7Oi7UU9kqvzdI/j0NYyPk2eKr06FPbN65WuoQXvSfRfkt52rJ+DhQpQpU1owpRUYrf1fFvb3mPtfGdFX0Uful6L+eHmd1Zn1AA8scBFzRc6s91DSo4Nqc9alX1OnDlD5nz2dd3PpYibn2jnN1L37Rzl2l+Oltua+F2RZbHVN6Ordm/Ll+ewklmd8Bz3NbPm2jRxr4KNe3lU/wBvHib/AAmmk0000mmndNPY0xDE4WzDy0zXc+T/AHzRxrIuABc4AAAA+HKuPhhqNStP3acb23yexRXNuy7z7jlXpBy929b1em70sPJqTWydbY30jrXXS5DeCwrxNqhy4vu+XwRdRV0k8uXM17KWOniKtSvUd5zlpPglsUVySsu4wpmJMsj1kq0lktyRvReW5GVMlMxpmRClkS6LMiZZMxJlkJziXRZkTLpmNMyU4tuMVtbsurE5xLoPrPV/RbB0r9EU+YM/pTA/5aZzP0g4Xs8fUe6tClVX8ui/ODNbsdC9KWC9nD4hL3XKjJ9VpR/CXic9PYbOt6TDQfUsvLd+MjDk8mAAOlesE3BsmYuRVisTpTSdLDaNSS+eTb0IvldNvpbeVXXRprdkuCBSbeSNwzCyD6tQ7apG1fEJOzWunS2xjyb2vuW42sHh5w5x0cFD23pVZK8KMX7T5yfwx5+FzxU5W4q5tLOUuX7yQxuSPSx2OpYenKrVnGnCO2Te/glvfJHMM6c76uL0qVK9LD7HG9qlVfW1sX0rvvu8jLWWK+MqdpWldK+hTjdU4LhFfntZ556PAbLhT9dn1T9F3db7fLrK+kzJIANclGRBsGbOddbBNQd6uHb1029cOLpvd02PltPAIK7aoWx0TWaLU8zueSsqUcVTVWhNTjsa2SjL5ZLcz7jhOS8pVsLUVWhNwktTW2M18slvR03N7PHD4pKNWUaFbY4zklCT4wk9T6PX12nlsbsuyj6ofVH1Xf8APnkDibSCEeLlzObDYSL06inUWyjTkpVG+a+Fc2Z1dc7JaYLN9hxLPgfJnvl31PD6NN2r4i8KdtsI/FPuvq5tHImfdlrKtTGVpV6u2VlGK92nBbIrz6ts+I9js/Cf01Wl/c977+rw+XzNKiOiPaQmWTKkpjk4jsWXTMiMSZdMTsiXRZdF0URZMTsiXRZdHq5t4ftcZh4cKtOb+7B6b8os8lG4ejnCadepWeylTaX35v8AxGXiZ+I+mEmcxFnR0zl2fncvU6MCCTHPJ5Hk5zZP9ZwleileUoOVP95H2o+LVu84uzvxyHPjJPq2Mm4q1PEXrR4Jt+3HuevpJG9sTEZOVL5717/Pgym/cszXgCT0QnrIPczUy88DUk3FzpVVGNSMbaSs24yjfVdXermeICu2qNsHCazTBWNPNG/5Z9IEXDRwkJqpL/sqxilD7sbu766upoderKpKU5ylOc3eUpPSlJ82UBVhsJVh1lWuPPn5kpXOXEgADJ1TIBIOlkZEAAC6MiASQBfGRZVGloptLgm0vAoSQdGYyAAAvjIEEsgBqLLIsiiLIosiXxZlRKKJl0JWIuiy6Oq5kYDscJCTVp4hutLo1aH9KT72c7zeyc8ViaVL4W1Ko+FOLvLx2dWjskYJJJKyWpJakkYm0J5ZQXf8GftO76VWue9+373FgAZhjg8HO7I3rmGlGK+2p/aUXxklrj3rV1s9x7wJ12Srmpx4p5nJJNZM4C1bU1ZrU01ZpixuvpByB2c3i6S+zqv7ZL4aj+LpL8epph7bDYiN9asjz9HzRjWp1ycWAAXFWsFSwA7rKgsDpYpFASQBbGQIJB0vjIgAMBiMiASQA1GRAAOjMGAAAzGRBZFSURms0MxZdGRGJGz5k5B9ardpUX2FFpzvsqT2qHTe+WreZ+JnGuDnLgiyViri5S4I23MPI3YUO2mrVcSlKz2wpatFdXtfVcDbADyVtjsm5vmefssdk3J8WAAQIAAABhr0Y1IyhNKUJpxlFq6cWrNM5JnXm/PBVdV5UKjfZz4fTL6l5rXxt2E+XHYKnXpypVYqcJqzT8mnua4jmCxksNPPjF8V7969RfEUK2OXBrgcNIse3nLm/UwVTW9OjNvs6nnoy4S/Hat6XjHsKrYWwU4PNMwJ6oScZbmiASQTOawCSALYyBUsAL4yKAkg6MQkQCSDozCQIJYAZgyCCSDo1FgAANQZBKB6WQMh1sZV7OmrRVu0qtexTjz4vgt/i1GycYRcpvJLmMqSis3wLZvZHqYysqdPVFWdSdrxhDi+b3Lf427Fk3AU8NShRpR0YQVlxb3tve29ZhyLkmlg6KpUlq2yk/fqT3yk+P4HpHjcfjXiZ7t0Vw+X+7u/MzcRe7Xu4L9zAAERYAAAAAAAAAA8DPegp4DEXXuKE48mprX4XXecjOy50xvgcV+6k/DWcbsel2I/+mS/9eyMDa262L7PdggkGyZikQADpfGRAAAZhIqCxVnRmLIIJADUGQASdGoMqQSQdQ1BgI9LI+QsTinajSco7HUleFKPWT29Fd8joWb+Y9DD6M69sRVVmrr7KD5R3vm/BCWK2hTh90nm+pcfHqGOljHiajmzmfVxejUqXpUNT02rTqL6E931PVwudQydk+lhqcaVGChCOxLa3vbe982fYDy2MxtmJf1bkuC/eLFrLZT48AABMrAAAAAAAAAAAAADzc4VfB4v9xVfhFnFtJnc8Zh1Up1Kb2VYTg+kotfmcXylk+phqkqVWLjKL4apLdKL3pnodh2R0zhzzz8Dz23IyTrmuG9ePI+RMGXC4WpVkoUoTqTfwwi5Prq2LmbfkrMGpK0sVNUo/s4WnPvlsj5mtfiqqFnZJL8+Rm4ai2/7I59vLz9jS0rtJa23ZJa23wSPcw2aOPqR01QcVuU5wpyf8Ld132Ol5LyJh8KvsaSi7WdR+1N/xPX3LUeoYt225N5VRyXW/hcPNm5RstJZ2S8F88/Q4ljci4qj+tw9SKXxaDlD+ZavM89M76fJicn0Kv62jSqfvKUJ/iiVe3Mvvr8n7PP8lr2dl9svNe/8HDip2OtmngZ7cNBfclOn/a0fPLMjJ7/6ZLpXrf7DMdt4fnGXkvk6sHNc1++ByMHW1mRgP2U31r1v9jNSzQwEdmGi/vzq1P7pM69t4dcIy8l8l0aJI48fXg8lYivbsaFWon8UacnH+bZ5nZsPknDU/wBXh6EHxjRhF+KR9wvZt1f4V+b9kvcYjDI5Zk/0f4qpZ1ZU6Ed932s1/DHV/UbXkrMfB0LSnF4ia31rOHdBavG5tAM27aeJt3atK6lu9ePqWZspCCikkkklZJKyS5IuAIHAAAAAAAAAAAAAAAAAAAAAaj6R/wDjQ/ef4AGcH/cV96Fcd/bWf6sv6Of+LL77NqRIDGf3FneGC/tqv9UAALDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z"
                          alt="social-copy"
                        />
                      </div>
                      <div className="like">
                        {productLiked ? (
                          <img
                            src="data:image/png;base64,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"
                            onClick={toggleLikeProduct}
                            alt="social-liked"
                          />
                        ) : (
                          <img
                            src="data:image/png;base64,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"
                            onClick={toggleLikeProduct}
                            alt="social-like"
                          />
                        )}
                        <p>{productLiked ? "Đã thích" : "Thích"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col l-7 m-6 c-12">
                <div className="product-detail">
                  <div className="compare">
                    <h4 className="product-name">{product.name}</h4>
                    <Link
                      className="product-compare"
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        compareProduct(product);
                      }}
                    >
                      + So sánh
                    </Link>
                  </div>
                  <div className="product-detail-info">
                    <p className="product-review">
                      <span>{product?.review_count}</span> Đánh Giá
                    </p>
                    <p className="product-seller">
                      <span>{product?.seller_count}</span> Đã Bán
                    </p>
                  </div>
                </div>
                <div className="product-detail-body">
                  <div className="left">
                    <p className="product-price">
                      <span className="product-price__current-price">
                        {currency(product.price)}
                      </span>
                      <span className="product-price__list-price">
                        {currency(product.list_price)}
                      </span>
                      <span className="product-price__discount">
                        {product.percent_discount}% giảm
                      </span>
                    </p>
                    <div className="product_pick_color">
                      <div className="prco_label">
                        Có{" "}
                        <strong>{product?.inventories?.length} Màu sắc</strong>.
                        Bạn đang chọn{" "}
                        <strong>
                          {color ? color : product?.inventories?.[0]?.color}
                        </strong>
                      </div>
                      .
                      <div className="color color_cover">
                        {product?.inventories?.map((item, index) => {
                          return (
                            <button
                              key={index}
                              className={`opt-var opt-var-97020 ${
                                color === item.color ||
                                product?.inventories.length === 1 ||
                                (index === 0 && !color)
                                  ? "active"
                                  : ""
                              }`}
                              title={item.color}
                              onClick={() => addQuery("color", item.color)}
                            >
                              <span>{item.color}</span>
                              <input type="hidden" />
                              <span className="prv-price">
                                <span>{currency(product?.price)}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div id="info-1" className="collapse in">
                      <div className="input-label">
                        <span>Số lượng</span>
                      </div>

                      <div className="group-input">
                        <button
                          className={quantity <= 1 ? "disable" : ""}
                          disabled={quantity <= 1}
                          onClick={() => setQuantity(quantity - 1)}
                        >
                          <img
                            src={`${DECREASE_IMG}`}
                            alt="remove-icon"
                            width={20}
                            height={20}
                          />
                        </button>
                        <input
                          type="number"
                          min={1}
                          className="input"
                          pattern="^[1-9]\d*"
                          value={
                            quantity <= 0
                              ? 1
                              : quantity >= product.in_stock
                              ? product.in_stock
                              : quantity
                          }
                          onChange={(e) =>
                            setQuantity(
                              parseInt(e.target.value) <= 1
                                ? 1
                                : parseInt(e.target.value) >= product.in_stock
                                ? product.in_stock
                                : parseInt(e.target.value)
                            )
                          }
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className={
                            quantity >= product.in_stock ? "disable" : ""
                          }
                          disabled={quantity >= product.in_stock}
                        >
                          <img
                            src={`${INCREASE_IMG}`}
                            alt="add-icon"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                      <div className="input-label">
                        {product.in_stock > 0 ? (
                          <span>{product.in_stock} sản phẩm có sẵn</span>
                        ) : (
                          <span>Hết hàng</span>
                        )}
                      </div>
                    </div>
                    <div className="group-button">
                      <button
                        className="btn btn-add-to-cart"
                        onClick={handleAddToCart}
                      >
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>
                  <div className="right">
                    <BrandProduct brand={product.brand} />
                  </div>
                </div>
              </div>
            </div>
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">Sản phẩm tương tự</h3>
                </div>
              </div>
              {loading ? (
                <ProductItemSkeleton total={similarProduct.length} />
              ) : (
                <>
                  {hasSimilarProduct ? (
                    <ProductItem products={similarProduct} />
                  ) : (
                    <div className="no-products">
                      {/* Không có sản phẩm tương tự */}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">Thông tin chi tiết</h3>
                </div>
              </div>
              <div className="col l-12 m-12 c-12">
                <div className="group">
                  <div className="content has-table">
                    <table>
                      <tbody>
                        <tr>
                          <td>Thương hiệu</td>
                          <td>{product?.brand?.name}</td>
                        </tr>
                        <tr>
                          <td>Xuất xứ thương hiệu</td>
                          <td>{product?.brand?.madeIn}</td>
                        </tr>
                        {product?.product_specs?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.attributeName}</td>
                              <td>{item.attributeValue}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">Mô tả sản phẩm</h3>
                </div>
              </div>
              <div className="col l-12 m-12 c-12">
                <div className="group">
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">
                    Đánh giá, nhận xét từ khách hàng
                  </h3>
                </div>
              </div>
              <div className="col l-12 m-12 c-12">
                {comments.length === 0 ? (
                  <div className="customer-reviews__empty">
                    <img src={`${API_URL}/images/star.png`} alt="" />
                    <span>Chưa có đánh giá nào cho sản phẩm này</span>
                  </div>
                ) : (
                  comments.map((item) => {
                    return (
                      <div className="review-comment" key={item.id}>
                        <div className="review-comment__user">
                          <div className="review-comment__user-inner">
                            <div className="review-comment__user-avatar">
                              <div className="has-character">
                                <img
                                  src={`${API_URL}/images/avatar.png`}
                                  alt=""
                                />
                              </div>
                            </div>
                            <div>
                              <div className="review-comment__user-name">
                                {item.displayName}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <div className="review-comment__rating-title">
                            <div className="review-comment__rating">
                              {displayComment(item.rating)}
                            </div>
                            <span className="review-comment__title">
                              {displayStatusRating(item.rating)}
                            </span>
                          </div>
                          <div className="review-comment__seller-name-attributes">
                            <div className="review-comment__seller-name">
                              Thương hiệu
                              <span className="review-comment__check-icon" />
                              {product.brand?.name}
                            </div>
                          </div>
                          <div className="review-comment__content">
                            {item.content}
                          </div>
                          <div className="review-comment__created-date">
                            <span>Nhận xét vào {item.date_comment}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
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
                    <ProductItem products={mostPopularProduct} />
                  ) : (
                    <div className="no-products">
                      {/* Không có sản phẩm tương tự */}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">Sản phẩm dành cho bạn</h3>
                </div>
              </div>
              {loading ? (
                <ProductItemSkeleton total={recommendList.length} />
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
            <div className="row sm-gutter section__item">
              <div className="col l-12 m-12 c-12">
                <div className="home-product-category-item">
                  <h3 className="home-product-title">Sản phẩm bạn đã xem</h3>
                </div>
              </div>
              {loading ? (
                <ProductItemSkeleton total={productViewed.length} />
              ) : (
                <>
                  {hasProductViewed ? (
                    <ProductItem products={productViewed} />
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
        // </div>
        <DetailProductSkeleton />
      )}
    </>
  );
}

export default DetailProduct;
