const CharityMerchOrder = require("../models/CharityMerchOrder");

exports.createCharityMerchOrder = async (req, res) => {
  try {
    const { name, email, country, phone, packageType, message } = req.body;

    if (!name || !email || !country || !packageType) {
      return res.status(400).json({
        message: "Name, email, country, and package type are required.",
      });
    }

    const order = await CharityMerchOrder.create({
      name,
      email,
      country,
      phone,
      packageType,
      message,
    });

    res.status(201).json({
      message: "Your support request has been received successfully.",
      order,
    });
  } catch (error) {
    console.error("Charity merch order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCharityMerchOrders = async (req, res) => {
  try {
    const orders = await CharityMerchOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

exports.updateCharityMerchOrderStatus = async (req, res) => {
  try {
    const order = await CharityMerchOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    await order.save();

    res.json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
};

exports.deleteCharityMerchOrder = async (req, res) => {
  try {
    const order = await CharityMerchOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
};