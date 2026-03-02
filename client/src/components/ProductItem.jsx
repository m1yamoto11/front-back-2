import React from 'react';

export default function ProductItem({ product, onEdit, onDelete }) {
    return (
        <div className="product-item">
            <div className="product-info">
                <div className="product-id">#{product.id}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-category">{product.category}</div>
                <div className="product-price">{product.price} ₽</div>
                <div className="product-stock">В наличии: {product.stock}</div>
            </div>
            <div className="product-actions">
                <button onClick={() => onEdit(product)}>Редактировать</button>
                <button onClick={() => onDelete(product.id)}>Удалить</button>
            </div>
        </div>
    );
}