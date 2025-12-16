import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styles from "./update_delete_product.module.css";

interface Category {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface ProductForm {
  name: string;
  categoryId: string;
  supplierId: string;
  price: string;
  quantity: string;
  date: string;
  description: string;
  image?: File | null;
}

const ProductCreatePage: React.FC = () => {
  // fake data tạm thời
  const categories: Category[] = [
    { id: 1, name: "Điện thoại" },
    { id: 2, name: "Laptop" },
    { id: 3, name: "Phụ kiện" },
  ];

  const suppliers: Supplier[] = [
    { id: 1, name: "Apple VN" },
    { id: 2, name: "Samsung VN" },
    { id: 3, name: "Asus Distributor" },
  ];

  const [form, setForm] = useState<ProductForm>({
    name: "iPhone 15 Pro Max",
    categoryId: "1",
    supplierId: "1",
    price: "35000000",
    quantity: "50",
    date: "2025-10-30",
    description: "Sản phẩm flagship của Apple năm 2025.",
    image: null,
  });

  const [preview, setPreview] = useState<string>(
    "https://placehold.co/100x100"
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    console.log("🧾 Cập nhật sản phẩm:", form);
    alert("Đã cập nhật sản phẩm (fake data).");
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    console.log("🗑 Xóa sản phẩm:", form);
    alert("Sản phẩm đã bị xóa (fake).");
  };

  return (
    <main className={styles["main-content"]}>
      <div className={styles["form-section"]}>
        <h1>Quản lí sản phẩm</h1>
        <form onSubmit={handleUpdate} encType="multipart/form-data">
          <div>
            <label htmlFor="name">Tên sản phẩm</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              placeholder="tên sản phẩm..."
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="categoryId">Danh mục</label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="supplierId">Nhà cung cấp</label>
            <select
              id="supplierId"
              name="supplierId"
              value={form.supplierId}
              onChange={handleChange}
            >
              <option value="">Chọn nhà cung cấp</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price">Đơn giá</label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              placeholder="Đơn giá..."
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="quantity">Số lượng</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={form.quantity}
              placeholder="Số lượng..."
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="date">Ngày nhập</label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              placeholder="Mô tả..."
              rows={4}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Hình ảnh</label>
            <div
              className={styles["image-upload"]}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <img src={preview} alt="preview" width={100} height={100} />
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.update}>
              Cập nhật
            </button>
            <button type="button" className={styles.delete} onClick={() => setShowDeleteModal(true)}>
              Xóa
            </button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa sản phẩm "{form.name}" không?</p>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={handleDeleteConfirm}
              >
                Xóa luôn
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductCreatePage;
