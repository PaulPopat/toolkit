// import fs from "node:fs";
// import Js from "@toolkit/js-model";
// import path from "node:path";

const path = require("path");
const fs = require("fs");
const Js = require("@toolkit/js-model");

module.exports = () =>
  [
    new Js.Import(["CreateComponent"], "CreateComponent", false),
    new Js.Import([], "base", false),

    ...fs
      .readdirSync(path.resolve("src/components"))
      .map((p) => path.basename(p))
      .filter((p) => p.endsWith(".json"))
      .map((p) => ({
        data: JSON.parse(fs.readFileSync(path.resolve("src/components", p), "utf8")),
        name: p.replace(".json", ""),
      }))
      .map(
        ({ data, name }) =>
          new Js.Call(
            new Js.Reference("CreateComponent"),
            new Js.String(name),
            new Js.Function(
              [],
              "arrow",
              undefined,
              new Js.Call(new Js.Reference("import"), new Js.String(`./components/${name}`))
            ),
            ...data.attributes.map((a) => new Js.String(a))
          )
      ),
  ]
    .map((j) => j.toString())
    .join(";\n");
