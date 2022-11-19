const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

const envs = { development: "dev", production: "prod" };
const env = envs[process.env.NODE_ENV] || "dev";
const envConfig = require(`./webpack.${env}.js`);
module.exports = () => merge(commonConfig, envConfig);
