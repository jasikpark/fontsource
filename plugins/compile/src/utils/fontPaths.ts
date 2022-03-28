import resolveFrom from "resolve-from";

const fontPaths = (nameArr: string[]) => {
  const paths: string[] = [];
  for (let name of nameArr) {
    if (!name.includes("@fontsource/")) {
      name = "@fontsource/" + name;
    }

    try {
      console.log(resolveFrom(process.cwd(), name));
    } catch {
      console.error(`${name} is not found`);
      process.exit();
    }
  }
};

export { fontPaths };
