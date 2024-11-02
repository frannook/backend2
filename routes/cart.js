const express = require('express');
const Cart = require('../models/Cart');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Obtener el carrito del usuario
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Agregar un producto al carrito
router.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

// Eliminar un producto específico del carrito
router.delete('/remove/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
});

// Vaciar completamente el carrito
router.delete('/clear', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
});

module.exports = router;

// Obtener el carrito del usuario (ruta protegida)
router.get('/', authenticateToken, async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
      res.json(cart || { items: [] });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  });

  module.exports = router;