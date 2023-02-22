import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  moduleDirectories: ["node_modules", "src"],
  resolver: "jest-ts-webcompat-resolver",
  transform: {},
};

export default config;
