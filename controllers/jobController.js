const jobService = require("../services/jobService");

module.exports = {
  getAllJobs: async function (req, res) {
    const data = await jobService.fetchAllJobs();
    res.json(data);
  },

  getJobById: async function (req, res) {
    const job = await jobService.fetchJobById(req.params.id);
    if (!job) return res.status(404).send("Job not found");
    res.json(job);
  },

  createJob: async function (req, res) {
    const job = await jobService.saveNewJob(req.body);
    res.status(201).json(job);
  },

  updateJob: async function (req, res) {
    try {
      const updatedJob = await jobService.updateJobById(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!updatedJob) return res.status(404).send("Job not found");
      res.json(updatedJob);
    } catch (error) {
      res.status(500).send("Failed to update job: " + error.message);
    }
  },

  deleteJob: async function (req, res) {
    await jobService.removeJob(req.params.id);
    res.json({ success: true });
  },

  // generatePDF: async function (req, res) {
  //   try {
  //     const result = await jobService.buildPDFAndLink(req.params.id);
  //     if (!result) return res.status(404).send("PDF not generated");
  //     res.json(result);
  //   } catch (error) {
  //     res.status(500).send({ message: error.message });
  //   }
  // },

  getEarningsSummary: async function (req, res) {
    const summary = await jobService.calculateEarnings(req.query);
    res.json(summary);
  },
};
