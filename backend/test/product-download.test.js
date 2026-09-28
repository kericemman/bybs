const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

const Product = require("../src/models/Product");
const EbookDownload = require("../src/models/EbookDownload");
const Order = require("../src/models/Order");
const Subscriber = require("../src/models/Subscriber");
const cloudinary = require("../src/config/cloudinary");
const resend = require("../src/utils/resendClient");
const {
  downloadFreeEbook,
  requestFreeEbook,
} = require("../src/controllers/ebookDownload.controllers");

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

const request = (body = {}) => ({
  body,
  params: { slug: "free-guide" },
  protocol: "https",
  get: () => "buildyourbestself.org",
});

const downloadResponseRecorder = () => {
  const result = { statusCode: 200, body: undefined, headers: {}, redirectUrl: undefined };
  return {
    result,
    status(code) {
      result.statusCode = code;
      return this;
    },
    send(body) {
      result.body = body;
      return this;
    },
    set(name, value) {
      result.headers[name] = value;
      return this;
    },
    redirect(code, url) {
      result.statusCode = code;
      result.redirectUrl = url;
      return this;
    },
  };
};

test("paid ebooks cannot use the free delivery endpoint", async (t) => {
  t.mock.method(Product, "findOne", () => ({
    select: async () => ({
      _id: "product-1",
      title: "Paid guide",
      type: "ebook",
      price: 12,
      filePublicId: "bybs/ebooks/paid-guide.pdf",
    }),
  }));
  const createDownload = t.mock.method(EbookDownload, "create", async () => {
    throw new Error("A download record should not be created");
  });
  const sendEmail = t.mock.method(resend.emails, "send", async () => {
    throw new Error("An email should not be sent");
  });
  const res = responseRecorder();

  await requestFreeEbook(request({ name: "Reader", email: "reader@example.com" }), res);

  assert.equal(res.result.statusCode, 400);
  assert.match(res.result.body.message, /paid request/i);
  assert.equal(createDownload.mock.callCount(), 0);
  assert.equal(sendEmail.mock.callCount(), 0);
});

test("free ebook requests store the reader and email a private link", async (t) => {
  const product = {
    _id: "product-2",
    title: "Free growth guide",
    slug: "free-guide",
    type: "ebook",
    price: 0,
    filePublicId: "bybs/ebooks/free-guide.pdf",
  };
  t.mock.method(Product, "findOne", () => ({ select: async () => product }));

  let savedPayload;
  const download = {
    _id: "download-1",
    save: async () => download,
  };
  t.mock.method(EbookDownload, "create", async (payload) => {
    savedPayload = payload;
    return download;
  });
  let orderUpdate;
  t.mock.method(Order, "findOneAndUpdate", async (_query, update) => {
    orderUpdate = update;
    return { _id: "order-1" };
  });
  let subscriberUpdate;
  t.mock.method(Subscriber, "findOneAndUpdate", async (_query, update) => {
    subscriberUpdate = update;
    return { _id: "subscriber-1" };
  });

  let emailPayload;
  t.mock.method(resend.emails, "send", async (payload) => {
    emailPayload = payload;
    return { data: { id: "email-1" }, error: null };
  });
  const res = responseRecorder();

  await requestFreeEbook(request({ name: "  Test Reader  ", email: "READER@EXAMPLE.COM" }), res);

  assert.equal(res.result.statusCode, 201);
  assert.equal(savedPayload.name, "Test Reader");
  assert.equal(savedPayload.email, "reader@example.com");
  assert.equal(savedPayload.tokenHash.length, 64);
  assert.match(res.result.body.downloadUrl, /^\/api\/products\/download\//);
  assert.match(emailPayload.html, /Download your ebook/);
  assert.match(emailPayload.html, /\/api\/products\/download\//);
  assert.equal(download.emailStatus, "sent");
  assert.equal(download.emailProviderId, "email-1");
  assert.equal(orderUpdate.$setOnInsert.email, "reader@example.com");
  assert.equal(orderUpdate.$setOnInsert.status, "fulfilled");
  assert.equal(orderUpdate.$setOnInsert.source, "free-ebook");
  assert.deepEqual(subscriberUpdate.$addToSet, { sources: "free-ebook" });
  assert.equal(subscriberUpdate.$set?.isActive, undefined);
});

test("active ebook tokens redirect to a short-lived private file URL", async (t) => {
  const token = "valid-download-token";
  const expectedHash = crypto.createHash("sha256").update(token).digest("hex");
  const download = {
    product: "product-2",
    expiresAt: new Date(Date.now() + 60_000),
    downloadCount: 0,
    save: async () => download,
  };
  let downloadQuery;

  t.mock.method(EbookDownload, "findOne", (query) => {
    downloadQuery = query;
    return { select: async () => download };
  });
  t.mock.method(Product, "findById", () => ({
    select: async () => ({
      _id: "product-2",
      title: "Free growth guide",
      type: "ebook",
      price: 0,
      filePublicId: "bybs/ebooks/free-guide.pdf",
    }),
  }));
  t.mock.method(
    cloudinary.utils,
    "private_download_url",
    () => "https://res.cloudinary.com/private-download"
  );
  const res = downloadResponseRecorder();

  await downloadFreeEbook({ params: { token } }, res);

  assert.deepEqual(downloadQuery, { tokenHash: expectedHash });
  assert.equal(res.result.statusCode, 302);
  assert.equal(res.result.redirectUrl, "https://res.cloudinary.com/private-download");
  assert.equal(res.result.headers["Cache-Control"], "no-store");
  assert.equal(download.downloadCount, 1);
});

test("expired ebook tokens are rejected before loading the product", async (t) => {
  const download = {
    product: "product-2",
    expiresAt: new Date(Date.now() - 1_000),
  };
  t.mock.method(EbookDownload, "findOne", () => ({ select: async () => download }));
  const findProduct = t.mock.method(Product, "findById", () => {
    throw new Error("Expired downloads must not load the product");
  });
  const res = downloadResponseRecorder();

  await downloadFreeEbook({ params: { token: "expired-token" } }, res);

  assert.equal(res.result.statusCode, 404);
  assert.match(res.result.body, /no longer available/i);
  assert.equal(findProduct.mock.callCount(), 0);
});
