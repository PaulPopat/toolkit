import { StartServer } from "@toolkit/puristee";
import path from "node:path";
import process from "node:process";

StartServer({
  handler_dir: path.resolve(__dirname, "handlers"),
  port: 3000,
  threads: parseInt(process.env.THREADS ?? "6"),
});
