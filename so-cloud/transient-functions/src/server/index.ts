import CreateServer from "@toolkit/puristee";
import process from "node:process";

export const Server = CreateServer(process.env.DATA_DIR ?? "./data", {}, {});
