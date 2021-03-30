const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");

//post /api/orders
module.exports.getOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

//get /pai/orders/:id
module.exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  // console.log(order.user.name);

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//patch /api/orders/:id/pay
module.exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      },
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw new Error("Order not found");
  }
});

//get /api/orders/myorders
module.exports.getMyOrders = asyncHandler(async (req, res) => {
  console.log(req.user._id);
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

//get /api/orders
module.exports.getOrders = asyncHandler(async (req, res) => {
  // console.log(req.user._id);
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

//patch /api/orders/:id/pay
module.exports.updateOrderToDelivered = asyncHandler(async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
      isDelivered: true,
      deliveredAt: Date.now(),
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw new Error("Order not found");
  }
});
