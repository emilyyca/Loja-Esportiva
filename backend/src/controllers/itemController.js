const Item = require('../models/Item');

// GET /api/items
exports.getAll = async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// GET /api/items/:id
exports.getById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        error: 'Item não encontrado',
        message: `Nenhum item encontrado com o ID '${req.params.id}'`,
      });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

// POST /api/items
exports.create = async (req, res, next) => {
  try {
    const { marca, modelo, preco, foto } = req.body || {};

    const item = new Item({ marca, modelo, preco, foto });
    const savedItem = await item.save();

    res.status(201).json(savedItem);
  } catch (error) {
    next(error);
  }
};

// PUT /api/items/:id
exports.update = async (req, res, next) => {
  try {
    const { marca, modelo, preco, foto } = req.body || {};

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { marca, modelo, preco, foto },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        error: 'Item não encontrado',
        message: `Nenhum item encontrado com o ID '${req.params.id}'`,
      });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/items/:id
exports.remove = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        error: 'Item não encontrado',
        message: `Nenhum item encontrado com o ID '${req.params.id}'`,
      });
    }

    res.json({ message: 'Item excluído com sucesso', item });
  } catch (error) {
    next(error);
  }
};
