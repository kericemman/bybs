const test = require("node:test");
const assert = require("node:assert/strict");

const Product = require("../src/models/Product");
const EbookDownload = require("../src/models/EbookDownload");
const resend = require("../src/utils/resendClient");
const { requestFreeEbook } = require("../src/controllers/ebookDownload.controllers");

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
});
