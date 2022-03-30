import { Command, Flags } from "@oclif/core";
import { fontPaths } from "../utils/fontPaths";

export default class Compile extends Command {
  static strict = false; // Allows for a variable number of arguments

  static description = "The main compile command.";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    // flag to select output directory
    output: Flags.string({
      char: "o",
      description: "Output directory for files",
      required: true,
    }),
    // Select styles
    style: Flags.string({
      char: "s",
      description: "Select font-styles",
      default: "normal",
    }),
    // Select weights
    weight: Flags.string({
      char: "w",
      description: "Select font-weights",
      default: "normal",
    }),
    // Select display
    display: Flags.string({
      char: "d",
      description: "Select font-display",
      default: "swap",
    }),
    // Copy files to directory
    "copy-files": Flags.boolean({
      description: "Copies all binary font files to output directory",
    }),
    // Disable CSS generation
    "no-css": Flags.boolean({
      description: "Disable CSS generation",
    }),
    // Disable using variable fonts
    "no-variable": Flags.boolean({
      description: "Disables using variable fonts if present",
    }),
    // No variable fallback generation
    "no-fallback": Flags.boolean({
      description: "Disable generating fallback CSS for variable fonts",
      exclusive: ["no-variable"],
    }),
  };

  static args = [{ name: "path", multiple: true }];

  public async run(): Promise<void> {
    const { flags, raw } = await this.parse(Compile);

    // oclif doesn't properly support multiple args- https://github.com/oclif/parser/pull/63
    // All args are fonts to use - hooks into raw object which joins the args as "arg1:arg2:arg3"
    // Filter map is used just in case the order of type args and flags changed
    const fonts = raw
      .filter(arg => arg.type === "arg")
      .map(arg => arg.input)
      .join(":")
      .split(":");

    // Verify if font is installed
    fontPaths(fonts);

    console.dir(raw);
    this.log(fonts.join(" "));
  }
}
