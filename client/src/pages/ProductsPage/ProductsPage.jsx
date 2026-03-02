import React, { useState, useEffect } from 'react';
import './ProductsPage.scss';
import ProductList from '../../components/ProductList';
import ProductModal from '../../components/ProductModal';
import { api } from '../../api';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            alert('Не удалось загрузить товары');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode('create');
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setModalMode('edit');
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить товар?')) return;
        try {
            await api.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            console.error('Ошибка удаления:', err);
            alert('Не удалось удалить товар');
        }
    };

    const handleSubmit = async (productData) => {
        try {
            if (modalMode === 'create') {
                const newProduct = await api.createProduct(productData);
                setProducts([...products, newProduct]);
            } else {
                const updatedProduct = await api.updateProduct(editingProduct.id, productData);
                setProducts(products.map(p => 
                    p.id === editingProduct.id ? updatedProduct : p
                ));
            }
            setModalOpen(false);
        } catch (err) {
            console.error('Ошибка сохранения:', err);
            alert('Не удалось сохранить товар');
        }
    };

    return (
        <div className="products-page">
            <header className="page-header">
                <h1>Интернет-магазин</h1>
                <button className="btn-primary" onClick={openCreate}>
                    + Добавить товар
                </button>
            </header>
            <main>
                {loading ? (
                    <div className="loading">Загрузка...</div>
                ) : (
                    <ProductList 
                        products={products}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                )}
            </main>
            <ProductModal
                open={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
