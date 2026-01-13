import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailProductPage.css";
import productService from "../../services/ProductService";
import type { IProduct, ProductImage } from "../../services/Interface";
import IP from "../../assets/img/ip.png";
import { useAuth } from "../../context/AuthContext";
import cartService from "../../services/CartService";
import cartDetailService from "../../services/CartDetailService";
import reviewService from "../../services/ReviewService";
import type { IReview } from "../../services/Interface";
import orderService from "../../services/OrderService";



export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState("1TB");
  const [selectedColor, setSelectedColor] = useState("Titan Sa Mạc");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);


  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(Number(id));
        if (!data || !data.productId) {
          setProduct(null);
          return;
        }

        setProduct(data);

        if (data.productImages?.length) {
          const firstImg = data.productImages
            .slice()
            .sort((a, b) => a.img_index - b.img_index)[0]?.url;
          setSelectedImage(firstImg || "");
        }
      } catch (e) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    if (!product?.productId) return;

    setReviewLoading(true);

    reviewService
      .getByProductId(product.productId)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setReviewLoading(false));
  }, [product?.productId]);

  const handleBuyNow = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua hàng");
      navigate("/login", {
        state: { redirectTo: `/product-detail/${id}` },
      });
      return;
    }

    if (!product?.productId) {
      alert("Sản phẩm không hợp lệ");
      return;
    }

    try {
      const orderPayload = {
        userID: user.userId,
        items: [
          {
            productId: product.productId,
            quantity: 1, // mua ngay = 1 sp
          },
        ],
      };

      const order = await orderService.create(orderPayload);

      // 👉 điều hướng sang trang chi tiết đơn
      navigate(`/order/${order.orderID}`);
    } catch (err) {
      console.error(err);
      alert("Mua ngay thất bại");
    }
  };


  // const handleAddToCart = async () => {
  //   const hasToken = !!localStorage.getItem("accessToken");

  //   if (!user && !hasToken) {
  //     alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
  //     navigate("/login", {
  //       state: { redirectTo: `/product-detail/${id}` },
  //     });
  //     return;
  //   }
  //   const cartId = user?.cartId;

  //   if (!cartId) {
  //     alert("Giỏ hàng chưa được khởi tạo, vui lòng thêm sản phẩm lại");
  //     return;
  //   }
  //   if (!product) return;

  //   try {
  //     await cartDetailService.addToCart({
  //       cartId: Number(cartId),
  //       productId: product.productId ?? 0,
  //     });

  //     alert("Đã thêm sản phẩm vào giỏ hàng");
  //     navigate("/cartShop");
  //   } catch (e) {
  //     console.error(e);
  //     alert("Không thể thêm sản phẩm vào giỏ hàng");
  //   }
  // };

  const handleAddToCart = async () => {
    const hasToken = !!localStorage.getItem("accessToken");

    // ===== CHƯA ĐĂNG NHẬP =====
    if (!user && !hasToken) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login", {
        state: { redirectTo: `/product-detail/${id}` },
      });
      return;
    }

    const cartId = user?.cartId;

    if (!cartId) {
      alert("Giỏ hàng chưa được khởi tạo, vui lòng thử lại");
      return;
    }

    if (!product?.productId) {
      alert("Sản phẩm không hợp lệ");
      return;
    }

    try {
      /* ===== 1️⃣ GỌI BACKEND ADD TO CART ===== */
      await cartDetailService.addToCart({
        cartId: Number(cartId),
        productId: product.productId,
      });

      /* ===== 2️⃣ UPDATE LOCALSTORAGE (CHỈ ĐỂ BADGE) ===== */
      const raw = localStorage.getItem("cart_items");
      const cart = raw ? JSON.parse(raw) : [];

      const index = cart.findIndex(
        (i: any) => i.productId === product.productId
      );

      if (index >= 0) {
        cart[index].quantity += 1;
      } else {
        cart.push({
          productId: product.productId,
          quantity: 1,
        });
      }

      // LƯU ĐÚNG cart_items
      localStorage.setItem("cart_items", JSON.stringify(cart));

      // TÍNH TỔNG ĐÚNG cho badge
      const totalCount = cart.reduce(
        (sum: number, i: any) => sum + i.quantity,
        0
      );

      // LƯU ĐÚNG cart_count (CHỈ LÀ SỐ)
      localStorage.setItem("cart_count", String(totalCount));

      // BÁO HEADER UPDATE
      window.dispatchEvent(new Event("cart-updated"));

      alert("Đã thêm sản phẩm vào giỏ hàng");
      navigate("/cartShop");

    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const images: ProductImage[] = useMemo(() => {
    return product?.productImages
      ? product.productImages.slice().sort((a, b) => a.img_index - b.img_index)
      : [];
  }, [product?.productImages]);

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (!product) return <div className="error">Không tìm thấy sản phẩm</div>;

  return (
    <>
      <div className="product-container">
        <h1 className="product-title">
          {product.name} | Chính hãng VN/A
        </h1>

        <div className="rating-row">
          {"★".repeat(5)}
          <span>4.9 (15 đánh giá)</span>
        </div>

        <div className="product-grid">
          <div className="image-box">
            <img
              src={selectedImage || IP}
              className="main-img"
              alt={product.name}
            />

            <div className="thumb-list">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  className="thumb"
                  onClick={() => setSelectedImage(img.url)}
                  alt="thumb"
                />
              ))}
            </div>
          </div>

          <div className="detail-box">
            <div className="price-block">
              <div className="price-main">
                {product.price.toLocaleString("vi-VN")}đ
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-title">TÍNH NĂNG NỔI BẬT</div>
              <ul className="feature-list">
                <li><strong>Battery:</strong> {product.specification?.battery}</li>
                <li><strong>Camera:</strong> {product.specification?.camera}</li>
                <li><strong>CPU:</strong> {product.specification?.cpu}</li>
                <li><strong>OS:</strong> {product.specification?.os}</li>
                <li><strong>RAM:</strong> {product.specification?.ram}</li>
                <li><strong>Screen:</strong> {product.specification?.screen}</li>
                <li><strong>Storage:</strong> {product.specification?.storage}</li>
              </ul>
            </div>

            <div className="action-row">
              <button className="btn blue">Trả góp 0%</button>
              <button className="btn red" onClick={handleBuyNow}>
                🛒 Mua ngay
              </button>
            </div>

            <button
              className="btn-outline add-cart-btn"
              onClick={handleAddToCart}
            >
              🛒 Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        {/* ===== REVIEW SECTION ===== */}
        <div className="review-section">
          <h2 className="review-title">Đánh giá sản phẩm</h2>

          {reviewLoading && <p>Đang tải đánh giá...</p>}

          {!reviewLoading && reviews.length === 0 && (
            <p className="review-empty">Chưa có đánh giá nào</p>
          )}

          {reviews.map(r => (
            <div key={r.reviewID} className="review-item">
              <div className="review-header">
                <strong>{r.userName}</strong>
                <span className="review-stars">
                  {"★".repeat(r.rating)}
                </span>
              </div>

              <p className="review-comment">{r.comment}</p>

              {r.photoUrl && (
                <div className="review-image-wrapper">
                  <img
                    src={r.photoUrl}
                    alt="review"
                    className="review-image"
                    onClick={() => {
                      console.log("CLICK IMAGE:", r.photoUrl);
                      setPreviewImage(r.photoUrl || null);
                    }}
                  />

                </div>
              )}

              {r.videoUrl && (
                <video
                  src={r.videoUrl}
                  controls
                  className="review-video"
                />
              )}
            </div>
          ))}

          <button
            className="btn-outline"
            onClick={() => navigate("/historyOrder?tab=APPROVED")}
          >
            Vào lịch sử mua hàng đã hoàn thành để đánh giá
          </button>
        </div>
      </div>

      {/* ===== IMAGE PREVIEW MODAL ===== */}
      {previewImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="image-preview-content"
            onClick={e => e.stopPropagation()}
          >
            <img src={previewImage} alt="preview" />
            <button
              className="image-preview-close"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
