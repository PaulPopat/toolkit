import { PureRequest, IResponse, JsonResponse } from "@toolkit/puristee";
import { Server } from "server";

export default class Handler extends Server.Handler {
  readonly Url = "/health";
  readonly Method = "GET";

  async Process(request: PureRequest): Promise<IResponse> {
    return new JsonResponse("Ok", { hello: "world" });
  }
}
