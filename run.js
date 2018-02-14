const fs = require("fs");
const babel = require("babel-core");
const moriscript = require("./moriscript");

const fileName = process.argv[2];

fs.readFile(fileName, (err, data) => {
  if (err) throw err;

  const src = data.toString();

  const out = babel.transform(src, {
    plugins: [moriscript]
  });

  console.log(out.code);
});
