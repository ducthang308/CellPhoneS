import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import reviewService from "../../services/ReviewService";
import "./ProductReviewPage.css";

export default function ProductReviewPage() {
    const { productId } = useParams<{ productId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get("orderId");

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!productId || !orderId) {
            alert("Thiếu thông tin đơn hàng để đánh giá");
            return;
        }

        const formData = new FormData();
        formData.append("productID", productId);
        formData.append("rating", rating.toString());
        formData.append("comment", comment);

        formData.append("orderID", orderId);

        if (photo) formData.append("photo", photo);
        if (video) formData.append("video", video);

        try {
            setLoading(true);
            await reviewService.createReview(formData);
            alert("Đánh giá thành công");
            navigate(-1);
        } catch (e) {
            console.error(e);
            alert("Không thể gửi đánh giá");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prd-review-page">
            <h1>Đánh giá sản phẩm</h1>

            <div className="prd-review-page__rating">
                {[1, 2, 3, 4, 5].map(n => (
                    <span
                        key={n}
                        className={`prd-review-page__star ${n <= rating ? "active" : ""
                            }`}
                        onClick={() => setRating(n)}
                    >
                        ★
                    </span>
                ))}
            </div>

            <textarea
                placeholder="Chia sẻ cảm nhận của bạn..."
                value={comment}
                onChange={e => setComment(e.target.value)}
            />

            <div className="prd-review-page__upload">
                <label>
                    📷 Ảnh
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setPhoto(e.target.files?.[0] || null)}
                    />
                </label>

                <label>
                    🎥 Video
                    <input
                        type="file"
                        accept="video/*"
                        onChange={e => setVideo(e.target.files?.[0] || null)}
                    />
                </label>
            </div>

            <button
                className="prd-review-page__submit"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
        </div>
    );
}
