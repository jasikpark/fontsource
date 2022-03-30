import path from "path";

const fontPaths = (nameArr: string[]) => {
  const paths: string[] = [];
  for (let name of nameArr) {
    if (!name.includes("@fontsource/")) {
      name = `@fontsource/${name}`;
    }

    try {
      // eslint-disable-next-line unicorn/prefer-module
      const packagePath = require.resolve(name);
      console.log(path.dirname(packagePath));
    } catch {
      throw new Error(`${name} is not found.`);
    }
  }
};

export { fontPaths };
