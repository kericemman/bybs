const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const Order = require("../src/models/Order");
const Product = require("../src/models/Product");
const Subscriber = require("../src/models/Subscriber");
const { createCartOrder, markDelivered } = require("../src/controllers/paymentControllers");

const responseRecorder = () => {
  const result = { statusCode: 200, body: undefined };
  return {
    result,
    status(code) {
      result.statusCode = code;
      return this;
    },
    json(body) {
      result.body = body;
      return this;
    },
  };
};

test("checkout stores the order and synchronizes a consenting customer email", async (t) => {
  const productId = new mongoose.Types.ObjectId();
  t.mock.method(Product, "find", async () => [
    {
      _id: productId,
      title: "BYBS Journal",
      type: "merch",
      price: 15,
      stock: 8,
    },
  ]);

  let orderPayload;
  t.mock.method(Order, "create", async (payload) => {
    orderPayload = payload;
    return { _id: "order-1", ...payload };
  });

  let subscriberQuery;
  let subscriberUpdate;
  t.mock.method(Subscriber, "findOneAndUpdate", async (query, update) => {
    subscriberQuery = query;
    subscriberUpdate = update;
    return { _id: "subscriber-1" };
  });

  const req = {
    body: {
      customer: {
        name: "  Test Customer ",
        email: "CUSTOMER@EXAMPLE.COM",
        phone: "+254700000000",
        country: "Kenya",
        shippingAddress: "Nairobi",
      },
      items: [{ productId: productId.toString(), quantity: 2 }],
      marketingConsent: true,
    },
  };
  const res = responseRecorder();

  await createCartOrder(req, res);

  assert.equal(res.result.statusCode, 201);
  assert.equal(orderPayload.email, "customer@example.com");
  assert.equal(orderPayload.amount, 30);
  assert.equal(orderPayload.source, "checkout");
  assert.equal(orderPayload.marketingConsent, true);
  assert.deepEqual(subscriberQuery, { email: "customer@example.com" });
  assert.equal(subscriberUpdate.$set.isActive, true);
  assert.equal(subscriberUpdate.$addToSet.sources, "customer-checkout");
});

test("checkout stores a non-consenting customer without enabling campaigns", async (t) => {
  const productId = new mongoose.Types.ObjectId();
  t.mock.method(Product, "find", async () => [
    {
      _id: productId,
      title: "Growth Guide",
      type: "ebook",
      price: 5,
    },
  ]);
  t.mock.method(Order, "create", async (payload) => ({ _id: "order-2", ...payload }));

  let subscriberUpdate;
  t.mock.method(Subscriber, "findOneAndUpdate", async (_query, update) => {
    subscriberUpdate = update;
    return { _id: "subscriber-2" };
  });

  const res = responseRecorder();
  await createCartOrder(
    {
      body: {
        customer: {
          name: "Customer",
          email: "customer@example.com",
          phone: "+254700000000",
        },
        items: [{ productId: productId.toString(), quantity: 1 }],
        marketingConsent: false,
      },
    },
    res
  );

  assert.equal(res.result.statusCode, 201);
  assert.equal(subscriberUpdate.$set?.isActive, undefined);
  assert.deepEqual(subscriberUpdate.$addToSet, { sources: "customer-checkout" });
});

test("marking an order delivered also updates its status to fulfilled", async (t) => {
  const order = {
    delivered: false,
    status: "pending",
    save: async () => order,
  };
  t.mock.method(Order, "findById", async () => order);
  const res = responseRecorder();

  await markDelivered({ params: { id: "order-1" } }, res);

  assert.equal(res.result.statusCode, 200);
  assert.equal(order.delivered, true);
  assert.equal(order.status, "fulfilled");
  assert.equal(res.result.body.order, order);
});
