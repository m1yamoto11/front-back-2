import React, { useEffect, useState } from 'react';

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        if (!open) return;
        if (initialProduct) {
            setName(initialProduct.name || '');
            setCategory(initialProduct.category || '');
            setDescription(initialProduct.description || '');
            setPrice(initialProduct.price?.toString() || '');
            setStock(initialProduct.stock?.toString() || '');
        } else {
            setName('');
            setCategory('');
            setDescription('');
            setPrice('');
            setStock('');
        }
    }, [open, initialProduct]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const productData = {
            name: name.trim(),
            category: category.trim(),
            description: description.trim(),
            price: Number(price),
            stock: Number(stock)
        };

        if (mode === 'edit' && initialProduct) {
            productData.id = initialProduct.id;
        }

        onSubmit(productData);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{mode === 'edit' ? 'Редактировать товар' : 'Добавить товар'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Категория:</label>
                        <input 
                            type="text" 
                            value={category} 
                            onChange={e => setCategory(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание:</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Цена (₽):</label>
                        <input 
                            type="number" 
                            value={price} 
                            onChange={e => setPrice(e.target.value)}
                            required
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label>Количество на складе:</label>
                        <input 
                            type="number" 
                            value={stock} 
                            onChange={e => setStock(e.target.value)}
                            required
                            min="0"
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose}>Отмена</button>
                        <button type="submit">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
}