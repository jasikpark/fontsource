require("@ayuhito/eslint-config/patch");

module.exports = {
  extends: ["@ayuhito/eslint-config/profile/next"],
  parserOptions: { tsconfigRootDir: __dirname },
};
