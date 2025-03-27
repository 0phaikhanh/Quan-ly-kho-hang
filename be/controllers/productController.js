// controllers/productController.js
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { Product, Transaction, User } = require('../models');

// @desc    Lấy tất cả sản phẩm
// @route   GET /api/products
// @access  Private
exports.getProducts = asyncHandler(async (req, res) => {
  // Xử lý filter query
  const filter = {};
  
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  if (req.query.search) {
    filter[Op.or] = [
      { name: { [Op.like]: `%${req.query.search}%` } },
      { code: { [Op.like]: `%${req.query.search}%` } },
      { description: { [Op.like]: `%${req.query.search}%` } }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;
  
  // Sorting
  const order = [];
  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    order.push([sortField, sortOrder]);
  } else {
    order.push(['created_at', 'DESC']); // Default sort by newest
  }

  // Execute query
  const { count, rows: products } = await Product.findAndCountAll({
    where: filter,
    order,
    offset,
    limit,
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name']
      }
    ]
  });

  // Pagination result
  const pagination = {
    total: count,
    page,
    limit,
    pages: Math.ceil(count / limit)
  };

  res.json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

// @desc    Lấy thông tin một sản phẩm
// @route   GET /api/products/:id
// @access  Private
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name']
      }
    ]
  });

  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  res.json({
    success: true,
    data: product
  });
});

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {
  // Thêm thông tin người tạo
  req.body.created_by = req.user.id;
  req.body.updated_by = req.user.id;

  // Kiểm tra xem code đã tồn tại chưa
  const existingProduct = await Product.findOne({ where: { code: req.body.code } });
  if (existingProduct) {
    res.status(400);
    throw new Error('Mã sản phẩm đã tồn tại');
  }

  // Tạo sản phẩm mới
  const product = await Product.create(req.body);

  // Tạo transaction nhập kho ban đầu nếu số lượng > 0
  if (product.quantity > 0) {
    await Transaction.create({
      type: 'import',
      product_id: product.id,
      quantity: product.quantity,
      previous_quantity: 0,
      new_quantity: product.quantity,
      price: product.price,
      note: 'Nhập kho ban đầu',
      performed_by: req.user.id
    });
  }

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Cập nhật thông tin sản phẩm
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res) => {
  // Tìm sản phẩm
  let product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Thêm người cập nhật
  req.body.updated_by = req.user.id;

  // Lưu số lượng cũ để tạo transaction nếu có thay đổi
  const oldQuantity = product.quantity;
  
  // Cập nhật sản phẩm
  await product.update(req.body);

  // Tạo transaction nếu số lượng thay đổi
  if (req.body.quantity !== undefined && oldQuantity !== req.body.quantity) {
    const quantityChange = req.body.quantity - oldQuantity;
    
    await Transaction.create({
      type: quantityChange > 0 ? 'import' : 'export',
      product_id: product.id,
      quantity: Math.abs(quantityChange),
      previous_quantity: oldQuantity,
      new_quantity: req.body.quantity,
      price: product.price,
      note: `${quantityChange > 0 ? 'Nhập' : 'Xuất'} kho từ cập nhật sản phẩm`,
      performed_by: req.user.id
    });
  }

  // Refresh product data
  product = await Product.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name']
      }
    ]
  });

  res.json({
    success: true,
    data: product
  });
});

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private (chỉ admin có thể xóa)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Chỉ admin hoặc người tạo sản phẩm mới được xóa
  if (req.user.role !== 'admin' && 
      product.created_by !== req.user.id) {
    res.status(403);
    throw new Error('Không có quyền xóa sản phẩm này');
  }

  // Kiểm tra xem sản phẩm đã có giao dịch chưa
  const transactions = await Transaction.findAll({
    where: { product_id: req.params.id }
  });
  
  if (transactions.length > 0) {
    res.status(400);
    throw new Error(
      'Không thể xóa sản phẩm này vì đã có giao dịch liên quan. Vui lòng cập nhật trạng thái thay vì xóa.'
    );
  }

  // Xóa sản phẩm
  await product.destroy();

  res.json({
    success: true,
    message: 'Xóa sản phẩm thành công'
  });
});

// @desc    Nhập kho
// @route   POST /api/products/:id/import
// @access  Private
exports.importProduct = asyncHandler(async (req, res) => {
  const { quantity, price, note, supplier } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!quantity || quantity <= 0) {
    res.status(400);
    throw new Error('Số lượng nhập phải lớn hơn 0');
  }

  // Tìm sản phẩm
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Cập nhật số lượng sản phẩm
  const previousQuantity = product.quantity;
  const newQuantity = previousQuantity + quantity;

  // Cập nhật giá nếu có thay đổi
  if (price) {
    product.price = price;
  }

  product.quantity = newQuantity;
  await product.save();

  // Tạo transaction nhập kho
  const transaction = await Transaction.create({
    type: 'import',
    product_id: product.id,
    quantity,
    previous_quantity: previousQuantity,
    new_quantity: newQuantity,
    price: price || product.price,
    note: note || 'Nhập kho',
    supplier,
    performed_by: req.user.id
  });

  const transactionWithDetails = await Transaction.findByPk(transaction.id, {
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'code', 'name']
      },
      {
        model: User,
        as: 'performer',
        attributes: ['id', 'name']
      }
    ]
  });

  res.status(201).json({
    success: true,
    data: {
      product,
      transaction: transactionWithDetails
    }
  });
});

// @desc    Xuất kho
// @route   POST /api/products/:id/export
// @access  Private
exports.exportProduct = asyncHandler(async (req, res) => {
  const { quantity, price, note, customer } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!quantity || quantity <= 0) {
    res.status(400);
    throw new Error('Số lượng xuất phải lớn hơn 0');
  }

  // Tìm sản phẩm
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Kiểm tra số lượng tồn kho
  if (product.quantity < quantity) {
    res.status(400);
    throw new Error('Số lượng xuất lớn hơn số lượng tồn kho');
  }

  // Cập nhật số lượng sản phẩm
  const previousQuantity = product.quantity;
  const newQuantity = previousQuantity - quantity;

  product.quantity = newQuantity;
  await product.save();

  // Tạo transaction xuất kho
  const transaction = await Transaction.create({
    type: 'export',
    product_id: product.id,
    quantity,
    previous_quantity: previousQuantity,
    new_quantity: newQuantity,
    price: price || product.price,
    note: note || 'Xuất kho',
    customer,
    performed_by: req.user.id
  });

  const transactionWithDetails = await Transaction.findByPk(transaction.id, {
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'code', 'name']
      },
      {
        model: User,
        as: 'performer',
        attributes: ['id', 'name']
      }
    ]
  });

  res.status(201).json({
    success: true,
    data: {
      product,
      transaction: transactionWithDetails
    }
  });
});

// @desc    Lấy danh sách sản phẩm sắp hết hàng
// @route   GET /api/products/low-stock
// @access  Private
exports.getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    where: { status: 'low-stock' },
    order: [['quantity', 'ASC']],
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name']
      }
    ]
  });

  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Lấy danh sách giao dịch của sản phẩm
// @route   GET /api/products/:id/transactions
// @access  Private
exports.getProductTransactions = asyncHandler(async (req, res) => {
  // Kiểm tra sản phẩm tồn tại
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Lấy danh sách giao dịch
  const transactions = await Transaction.findAll({
    where: { product_id: req.params.id },
    order: [['created_at', 'DESC']],
    include: [
      {
        model: User,
        as: 'performer',
        attributes: ['id', 'name']
      }
    ]
  });

  res.json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});