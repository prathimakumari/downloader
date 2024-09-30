const express = require("express");
const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Route to handle video download
app.get("/download", async (req, res) => {
  const videoURL = req.query.url;

  if (!videoURL) {
    return res.status(400).send("URL is required");
  }

  try {
    if (ytdl.validateURL(videoURL)) {
      // If it's a YouTube URL
      const videoStream = ytdl(videoURL, { format: "mp4" });
      res.header("Content-Disposition", "attachment; filename=video.mp4");
      videoStream.pipe(res); // Stream directly to response
    } else {
      // Handle direct video URLs
      const response = await axios.get(videoURL, { responseType: "stream" });
      res.header("Content-Disposition", "attachment; filename=video.mp4");
      response.data.pipe(res); // Stream directly to response
    }
  } catch (error) {
    console.error("Error downloading video:", error.message);
    res.status(500).send("Error downloading the video");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
