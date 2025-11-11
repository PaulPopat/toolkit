import { CodeLocation } from "../../location/code-location";
import { WriterFunction } from "../../writer/entity";
import {
  WriterExpression,
  WriterGlobalReferenceExpression,
} from "../../writer/expression";
import { WriterFile } from "../../writer/file";
import { LinkedEntity } from "../entity/base";
import { LinkedType } from "../type/base";
import { LinkedExpression } from "./base";

export class LinkedEntityExpression extends LinkedExpression {
  readonly #entity: LinkedEntity;

  constructor(ctx: CodeLocation, entity: LinkedEntity) {
    super(ctx);
    this.#entity = entity;
  }

  get Type(): LinkedType {
    return this.#entity.Type;
  }

  Build(
    file: WriterFile,
    func: WriterFunction
  ): [WriterFile, WriterFunction, WriterExpression] {
    let sub_func: WriterFunction;
    [file, sub_func] = this.#entity.Declare(file);
    return [file, func, new WriterGlobalReferenceExpression(sub_func)];
  }
}
