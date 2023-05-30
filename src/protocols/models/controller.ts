import { HTTPRequest, HTTPResponse } from "./http";

export interface Controller {
  handle(request: HTTPRequest): Promise<HTTPResponse>
}
