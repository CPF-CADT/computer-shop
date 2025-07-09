import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export const testEnvironment = "node";
export const preset = 'ts-jest';
export const transform = {
  ...tsJestTransformCfg,
};