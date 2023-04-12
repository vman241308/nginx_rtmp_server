var fluentFFmpeg = require("fluent-ffmpeg");
const { constants } = require("./constants");

const DownloadFFmpeg = new fluentFFmpeg();
const StreamFFmpeg = new fluentFFmpeg();

const downloadVideo = () => {
  let newVideoName = `${Date.now()}.mp4`;
  DownloadFFmpeg.addInput(constants.videoPublicURL)
    .on("start", function (ffmpegCommand) {
      console.log("Query:" + ffmpegCommand);
    })
    .on("progress", function (progress) {
      `frames: ${progress.frames} currentFps: ${progress.currentFps} currentKbps: ${progress.currentKbps} targetSize: ${progress.targetSize} timemark: ${progress.timemark}`;
    })
    .on("stderr", function (stderrLine) {
      console.log("Stderr output :" + stderrLine);
    })
    .on("error", function (err) {
      console.log("Error:" + err.message);
    })
    .on("end", function () {
      console.log("Download end reached");
      streamVideo(newVideoName);
    })
    .outputOptions([
      `-c:v ${constants.videoCodec}`,
      "-ss 00:00:15",
      "-t 00:00:50",
      `-c:a ${constants.audioCodec}`,
    ])
    .output(newVideoName)
    .run();
};

const streamVideo = (newVideoName) => {
  StreamFFmpeg.addInput(newVideoName)
    .on("start", function (ffmpegCommand) {
      console.log("Query:" + ffmpegCommand);
    })
    .on("progress", function (progress) {
      `frames: ${progress.frames} currentFps: ${progress.currentFps} currentKbps: ${progress.currentKbps} targetSize: ${progress.targetSize} timemark: ${progress.timemark}`;
    })
    .on("stderr", function (stderrLine) {
      console.log("Stderr output :" + stderrLine);
    })
    .on("error", function (err) {
      console.log("Error:" + err.message);
    })
    .on("end", function () {
      console.log("Stream end reached");
    })
    .outputOptions([
      `-c:v ${constants.videoCodec}`,
      `-c:a ${constants.audioCodec}`,
      "-f:flv",
    ])
    .output("rtmp://localhost/live/stream")
    .run();
};

downloadVideo();
