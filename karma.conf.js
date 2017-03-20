"use strict"

module.exports = config => {
  config.set({
    autoWatch: true,
    browsers: ["Chrome"],
    files: [
      "karma/index.js",
    ],
    reporters: ["spec"],
    singleRun: false
  })
}
