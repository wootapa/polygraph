import { PolygraphCore as Polygraph } from './core/polygraph';
import { IJsonDump, IRuntimeOperatorCallback } from './core/contracts';

const and = (): Polygraph => Polygraph.and();
const or = (): Polygraph => Polygraph.or();
const not = (): Polygraph => Polygraph.not();
const fromJson = (json: IJsonDump | string): Polygraph => Polygraph.fromJson(json);
const define = (alias: string, func: IRuntimeOperatorCallback): void => Polygraph.define(alias, func);
const getOperatorAlias = (): string[] => Polygraph.getOperatorAlias();

export { Polygraph, and, or, not, fromJson, define, getOperatorAlias };
