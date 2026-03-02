const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

let products = [
    { id: 1, name: 'Ноутбук', price: 50000 },
    { id: 2, name: 'Мышь', price: 1500 },
    { id: 3, name: 'Клавиатура', price: 3000 }
];

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API интернет-магазина',
            version: '1.0.0',
            description: 'API для управления товарами',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: Автоматически сгенерированный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         price:
 *           type: number
 *           description: Цена товара
 *       example:
 *         id: 1
 *         name: "Ноутбук"
 *         price: 50000
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Управление товарами
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/products', (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json(product);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создаёт новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 */
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'Название и цена обязательны' });
    }
    const newProduct = {
        id: Date.now(),
        name,
        price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Обновляет товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    const { name, price } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;
    res.json(product);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удаляет товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар удалён
 *       404:
 *         description: Товар не найден
 */
app.delete('/products/:id', (req, res) => {
    const initialLength = products.length;
    products = products.filter(p => p.id != req.params.id);
    if (products.length === initialLength) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json({ message: 'Товар удалён' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger UI доступен на http://localhost:${port}/api-docs`);
});