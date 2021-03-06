"use strict";

var visibility = {
  info: false,
  options: false,
  advanced: false
};
var modes = {
  "default": "default",
  noQR: "noQR",
  address: "address",
  discreet: "discreet"
};
var mode = "default";
document.addEventListener("DOMContentLoaded", function () {
  // eslint-disable-next-line no-undef
  var iota = new IOTA({
    host: "http://localhost",
    port: 14265
  });
  var imageCanvas = document.getElementById("imageCanvas");
  var ctx = imageCanvas.getContext("2d");
  var msg = "";
  var seedCanvas;
  var addressCanvas;
  var seed;
  var address;
  ctx.font = "bold 32px Roboto";
  ctx.textAlign = "center";
  ctx.fillText("ENTER A SEED AND PRESS GENERATE:", 800, 250);
  ctx.fillText("81 CHARACTERS IN LENGTH, CONTAINING ONLY: UPPERCASE [A-Z] AND 9", 800, 350);

  function generate() {
    var options = {};
    seed = document.getElementById("seed").value;
    seedCanvas = document.getElementById("seedCanvas");
    addressCanvas = document.getElementById("addressCanvas");
    var sec = parseInt(document.getElementById("security-level").value, 10);

    if (sec < 1 || sec > 3) {
      sec = 2;
    }

    options.index = parseInt(document.getElementById("index-num").value, 10);
    options.security = sec;
    options.deterministic = "off";
    options.checksum = true;
    options.total = 1;

    if (displayValid(seed)) {
      iota.api.getNewAddress(seed, options, function (e, add) {
        address = add[0];
        generatePaper();
      });
    } else {
      ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
      ctx.font = "bold 32px Roboto";
      ctx.textAlign = "center";
      ctx.fillText(msg, 800, 300);
    }
  }

  function generatePaper() {
    // eslint-disable-next-line no-undef
    var sQR = new QRious({
      element: seedCanvas,
      value: seed,
      size: 300,
      backgroundAlpha: 0
    }); // eslint-disable-next-line no-undef

    var aQR = new QRious({
      element: addressCanvas,
      value: address,
      size: 300,
      backgroundAlpha: 0
    });
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    if (mode !== modes.discreet) {
      var bg = new Image();

      bg.onload = function () {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.drawImage(bg, 0, 0, imageCanvas.width, imageCanvas.height);
        ctx.restore();

        if (mode === modes["default"] || mode === modes.address) {
          ctx.drawImage(addressCanvas, 1280, 120);

          if (mode === modes["default"]) {
            ctx.drawImage(seedCanvas, 20, 120);
          } else {
            ctx.textAlign = "center";
            ctx.font = "bold 28px Roboto";
            ctx.fillText("RECEIVING ADDRESS", 1430, 100);
          }
        }

        if (mode === modes["default"] || mode === "no-qr") {
          ctx.font = "bold 28px Roboto";
          ctx.textAlign = "center";
          var xPos = 170;
          var yPos = 460;

          if (mode === modes.noQR) {
            xPos = 110;
            yPos = 140;
          }

          ctx.fillText("PRIVATE SEED", xPos, yPos);
          ctx.font = "bold 24.6px Roboto";
          ctx.textAlign = "left";
          ctx.fillText(seed.substring(0, 27), 20, 40);
          ctx.fillText(seed.substring(27, 54), 20, 70);
          ctx.fillText(seed.substring(54), 20, 100);
          ctx.textAlign = "center";
          ctx.font = "bold 28px Roboto";
          xPos = 1430;
          yPos = 100;

          if (mode === modes.noQR) {
            xPos = 1445;
            yPos = 420;
          }

          ctx.fillText("RECEIVING ADDRESS", xPos, yPos);
        }

        ctx.textAlign = "right";
        ctx.font = "bold 24.6px Roboto";
        ctx.fillText(address.substring(0, 30), 1580, 460);
        ctx.fillText(address.substring(30, 60), 1580, 490);
        ctx.fillText(address.substring(60), 1580, 520);
        var img = new Image();

        img.onload = function () {
          ctx.drawImage(img, 400, 114, 800, 300);
        };

        img.src = "img/logo.png";
      };

      bg.src = "img/bg.png";
    } else {
      ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
      ctx.font = "bold 22px Roboto";
      ctx.textAlign = "center";
      ctx.fillText(seed, 800, 300);
    }

    document.getElementById("copy").style.visibility = "visible";
    document.getElementById("copy").innerHTML = "Generated Address: ".concat(address);
  }

  function displayValid(currentSeed) {
    var val = true;
    document.getElementById("validMessage").innerHTML = "";

    if (currentSeed === "") {
      msg = "Specify seed.";
      document.getElementById("validMessage").innerHTML = msg;
      val = false;
    } else if (!currentSeed.match(/^[A-Z9]*$/)) {
      msg = "THIS IS NOT A VALID SEED! CHARACTERS USED MUST BE ONLY UPPERCASE [A-Z] AND 9.";
      document.getElementById("validMessage").innerHTML = msg;
      val = false;
    } else if (currentSeed.length < 81) {
      msg = "Seed is less than 81 characters (".concat(currentSeed.length, "). For maximum security, use 81 characters.");
      document.getElementById("validMessage").innerHTML = msg;
      val = false;
    } else if (currentSeed.length > 81) {
      msg = "THIS IS NOT A VALID SEED! THIS SEED IS LONGER THAN 81 CHARACTERS (".concat(currentSeed.length, ")");
      document.getElementById("validMessage").innerHTML = msg;
      val = false;
    }

    return val;
  }

  function printWallet() {
    document.title = "_";
    window.print();
  }

  document.getElementById("generate").addEventListener("click", generate);
  document.getElementById("print").addEventListener("click", printWallet);
  document.getElementById("seed").addEventListener("keyup", function () {
    displayValid(document.getElementById("seed").value);
  });
});

function expandInfo() {
  var style = "hidden";

  if (!visibility.info) {
    style = "visible";
  }

  visibility.info = !visibility.info;
  document.getElementById("tooltiptext").style.visibility = style;
}

function expandOptions() {
  var style = "hidden";

  if (!visibility.options) {
    style = "visible";
  } else {
    document.getElementById("advanced").style.visibility = "hidden";
    visibility.advanced = false;
  }

  visibility.options = !visibility.options;
  document.getElementById("options").style.visibility = style;
}

function expandAdvanced() {
  var style = "hidden";

  if (!visibility.advanced && visibility.options) {
    style = "visible";
  }

  visibility.advanced = !visibility.advanced;
  document.getElementById("advanced").style.visibility = style;
}

function setMode(m) {
  mode = m;
  Object.keys(modes).forEach(function (key) {
    document.getElementById(modes[key]).classList.remove("button-active");
  });

  if (mode === modes["default"]) {
    document.getElementById(modes["default"]).classList.add("button-active");
  } else if (mode === modes.noQR) {
    document.getElementById(modes.noQR).classList.add("button-active");
  } else if (mode === modes.address) {
    document.getElementById(modes.address).classList.add("button-active");
  } else {
    document.getElementById(modes.discreet).classList.add("button-active");
  }
}
