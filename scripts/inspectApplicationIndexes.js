const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");

const inspectIndexes = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not configured.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: false,
      autoCreate: false,
    });

    const collection = mongoose.connection.db.collection("applications");
    const indexes = await collection.indexes();

    console.log(JSON.stringify(indexes, null, 2));
  } finally {
    await mongoose.disconnect();
  }
};

inspectIndexes().catch((err) => {
  console.error("Index inspection failed:", err.message);
  process.exit(1);
});
