// File: services/jobService.js
const Job = require("../models/Job");

module.exports = {
  fetchAllJobs: async function () {
    try {
      return await Job.find().sort({ jobDate: -1 });
    } catch (error) {
      throw new Error("Failed to fetch all jobs: " + error.message);
    }
  },

  fetchJobById: async function (id) {
    try {
      return await Job.findById(id);
    } catch (error) {
      throw new Error("Failed to fetch job: " + error.message);
    }
  },

  saveNewJob: async function (data) {
    try {
      const { jobDetails, labourCost = 0, ...rest } = data;
      const total = jobDetails.reduce(
        (sum, d) => sum + d.cost * (d.quantity || 1),
        0
      );
      return await new Job({
        ...rest,
        jobDetails,
        labourCost,
        totalCost: total + labourCost,
      }).save();
    } catch (error) {
      throw new Error("Failed to create job: " + error.message);
    }
  },

  modifyJob: async function (id, data) {
    try {
      const { jobDetails, labourCost = 0, ...rest } = data;
      const total = jobDetails.reduce(
        (sum, d) => sum + d.cost * (d.quantity || 1),
        0
      );
      return await Job.findByIdAndUpdate(
        id,
        { ...rest, jobDetails, labourCost, totalCost: total + labourCost },
        { new: true }
      );
    } catch (error) {
      throw new Error("Failed to update job: " + error.message);
    }
  },

  removeJob: async function (id) {
    try {
      return await Job.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Failed to delete job: " + error.message);
    }
  },

  //   buildPDFAndLink: async function (id) {
  //     const job = await Job.findById(id);
  //     if (!job) return null;

  //     const doc = new PDFDocument();
  //     const buffers = [];

  //     doc.on("data", buffers.push.bind(buffers));
  //     const finished = new Promise((resolve) => {
  //       doc.on("end", () => {
  //         const buffer = Buffer.concat(buffers);
  //         const stream = cloudinary.uploader.upload_stream(
  //           { resource_type: "raw" },
  //           (err, result) => {
  //             if (err || !result) return resolve(null);
  //             resolve({
  //               pdfUrl: result.secure_url, // ✅ this must be returned
  //               whatsappLink: `https://wa.me/${
  //                 job.customerPhone
  //               }?text=${encodeURIComponent(
  //                 `Hi ${job.customerName}, here’s your car repair receipt:\n${result.secure_url}`
  //               )}`,
  //             });
  //           }
  //         );
  //         streamifier.createReadStream(buffer).pipe(stream);
  //       });
  //     });

  //     // Write your content
  //     doc.text(`Customer: ${job.customerName}`);
  //     doc.end();

  //     return await finished;
  //   },

  calculateEarnings: async function ({ range, start, end }) {
    console.log(start)
    try {
      let filter = {};

      if (start && end) {
        filter.jobDate = { $gte: new Date(start), $lte: new Date(end) };
      } else if (range) {
        const now = new Date();
        let from;
        switch (range) {
          case "daily":
            from = new Date(now.setHours(0, 0, 0, 0));
            break;
          case "weekly":
            from = new Date(now.setDate(now.getDate() - 7));
            break;
          case "monthly":
            from = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case "yearly":
            from = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            return { totalEarnings: 0, count: 0 };
        }
        filter.jobDate = { $gte: from };
      }

      const jobs = await Job.find(filter);
      console.log(jobs)
      const total = jobs.reduce((sum, job) => sum + job.totalCost, 0);
      return { totalEarnings: total, count: jobs.length };
    } catch (error) {
      throw new Error("Failed to calculate earnings: " + error.message);
    }
  },

  updateJobById: async function (id, updateData) {
    // console.log(updateData)
    const job = await Job.findByIdAndUpdate(id, updateData, { new: true });
    if (!job) throw new Error("Job not found");
    return job;
  },
};
