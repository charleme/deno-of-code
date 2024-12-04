import {getLastDayNumber} from "./utils.ts";

const copyDirectory = async (source: string, destination: string) => {
  await Deno.mkdir(destination);
  for await (const entry of Deno.readDir(source)) {
    const sourcePath = `${source}/${entry.name}`;
    const destPath = `${destination}/${entry.name}`;

    if (entry.isDirectory) {
      await copyDirectory(sourcePath, destPath);
    } else if (entry.isFile) {
      // Copy file
      await Deno.copyFile(sourcePath, destPath);
    }
  }
};

const destinationDirectory = `day${
  (getLastDayNumber() + 1).toString().padStart(2, "0")
}`;
copyDirectory("day-template", destinationDirectory);
