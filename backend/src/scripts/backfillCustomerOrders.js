require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const EbookDownload = require("../models/EbookDownload");
const Order = require("../models/Order");
const Subscriber = require("../models/Subscriber");
const syncCustomerEmail = require("../utils/syncCustomerEmail");

const run = async () => {
  const results = {
    ebookOrdersCreated: 0,
    customerEmailsSynced: 0,
  };

  try {
    await connectDB();
    await Promise.all([Order.createIndexes(), Subscriber.createIndexes()]);

    const successfulDownloads = await EbookDownload.find({ emailStatus: "sent" }).lean();

    for (const download of successfulDownloads) {
      const orderResult = await Order.updateOne(
        { ebookDownload: download._id },
        {
          $setOnInsert: {
            ebookDownload: download._id,
            product: download.product,
            items: [
              {
                product: download.product,
                title: download.productTitle,
                type: "ebook",
                quantity: 1,
                price: 0,
              },
            ],
            name: download.name,
            email: download.email,
            amount: 0,
            reference: `BYBS-FREE-${download._id}`,
            status: "fulfilled",
            source: "free-ebook",
            delivered: true,
          },
        },
        { upsert: true, setDefaultsOnInsert: true }
      );

      results.ebookOrdersCreated += orderResult.upsertedCount;
    }

    const customerOrders = await Order.find().select("email name source").lean();

    for (const order of customerOrders) {
      const contact = await syncCustomerEmail({
        email: order.email,
        name: order.name,
        source: order.source === "free-ebook" ? "free-ebook" : "customer-checkout",
        marketingConsent: false,
      });

      if (contact) results.customerEmailsSynced += 1;
    }

    console.log(JSON.stringify(results));
  } catch (error) {
    console.error("Customer order backfill failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
