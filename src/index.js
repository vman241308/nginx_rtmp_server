var fluentFFmpeg = require("fluent-ffmpeg");
const { constants } = require("./constants");

const DownloadFFmpeg = new fluentFFmpeg();
const StreamFFmpeg = new fluentFFmpeg();
const BlackStreamFFmpeg = new fluentFFmpeg();

const videoRTMP = () => {
  console.log("----------------------------------- Start ----------------------------------------");
  let newVideoName = `${Date.now()}.mp4`;
  blackStreamVideo();
  DownloadFFmpeg.addInput(constants.videoPublicURL)
    .on("start", function (ffmpegCommand) {
      console.log("Query:" + ffmpegCommand);
      console.log("----------------------------------- Download Start! ----------------------------------------");
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
      console.log("----------------------------------- Download Finish! ----------------------------------------");
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
  BlackStreamFFmpeg.kill();
  StreamFFmpeg.addInput(newVideoName)
    .on("start", function (ffmpegCommand) {
      console.log("Query:" + ffmpegCommand);
      console.log("----------------------------------- Stream Start & BlackStream Finish! ----------------------------------------");
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
      console.log("----------------------------------- Stream Finish! ----------------------------------------");
    })
    .outputOptions([
      `-c:v ${constants.videoCodec}`,
      `-c:a ${constants.audioCodec}`,
      "-ar 44100",
      "-ac 1",
      "-f flv",
    ])
    .output("rtmp://localhost/live/stream")
    .run();
};

const blackStreamVideo = () => {
  // ffmpeg -re -i "1681311765522.mp4" -c:v copy -c:a aac -ar 44100 -ac 1 -f flv rtmp://localhost/live/stream
  BlackStreamFFmpeg.addInput("../black.mp4")
    .on("start", function (ffmpegCommand) {
      console.log("----------------------------------- BlackStream Start! ----------------------------------------");
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
      console.log("BlackStream end reached");
      console.log("----------------------------------- BlackStream Finish! ----------------------------------------");
    })
    .inputOptions([
      "-re",
      "-stream_loop -1"
    ])
    .outputOptions([
      `-c:v ${constants.videoCodec}`,
      `-c:a ${constants.audioCodec}`,
      "-ar 44100",
      "-ac 1",
      "-f flv",
    ])
    .output("rtmp://localhost/live/stream")
    .run();
};

videoRTMP();
// streamVideo();
