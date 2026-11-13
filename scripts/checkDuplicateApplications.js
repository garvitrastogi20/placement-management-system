const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");

const checkDuplicates = async () => {
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
    const totalApplications = await collection.countDocuments();
    const duplicates = await collection
      .aggregate([
        {
          $group: {
            _id: { student: "$student", job: "$job" },
            count: { $sum: 1 },
          },
        },
        { $match: { count: { $gt: 1 } } },
      ])
      .toArray();

    const extraDuplicateDocs = duplicates.reduce(
      (sum, item) => sum + (item.count - 1),
      0,
    );

    console.log(
      JSON.stringify(
        {
          totalApplications,
          duplicatePairs: duplicates.length,
          extraDuplicateDocs,
        },
        null,
        2,
      ),
    );
  } finally {
    await mongoose.disconnect();
  }
};

checkDuplicates().catch((err) => {
  console.error("Duplicate check failed:", err.message);
  process.exit(1);
});
