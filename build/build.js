const fs = require("fs");
const archiver = require("archiver");
const hasha = require("hasha");
const writeFile = require("write");

const output = fs.createWriteStream("./out/offline-build.zip");
const archive = archiver("zip", {
  zlib: { level: 9 }
});

output.on("close", function() {
  hasha
    .fromFile("out/offline-build.zip", { algorithm: "sha256" })
    .then(hash => {
      writeFile("checksum.md", `Sha256: ${hash}\n`, function(err) {
        if (err) console.log(err);
        console.log(`Sha256 hash: ${hash}`);
        console.log("Build complete.");
      });
    });
});

archive.on("warning", function(err) {
  if (err.code !== "ENOENT") throw err;
});

archive.on("error", function(err) {
  throw err;
});

archive.directory("img/", "img");
archive.directory("fonts/", "fonts");
archive.directory("css/", "css");
archive.directory("js/", "js");
archive.file("index.html", { name: "index.html" });

archive.pipe(output);

archive.finalize();
