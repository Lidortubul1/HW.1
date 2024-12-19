const fs = require("fs");
const path = require("path");
const readline = require("readline");

// שמות קבצי הקלט
const inputDir = "./input/";
const outputDir = "./output/";
const inputFiles = Array.from({ length: 10 }, (_, i) => `input${i + 1}.txt`);
const outputFile = path.join(outputDir, "output.txt");

// קריאת שורות מקובץ
async function readLinesFromFile(filename, numLines) {
  const lines = [];
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lines.push(line);
    if (lines.length === numLines) break;
  }

  rl.close();
  return lines;
}

// פונקציה ראשית
async function mergeFiles() {
  try {
    // ניקוי תוכן הפלט הקיים
    fs.writeFileSync(outputFile, "");

    for (let i = 0; i < inputFiles.length; i++) {
      const fileIndex = i + 1; // המספר של הקובץ הנוכחי
      const numLines = fileIndex; // מספר השורות להעתיק
      const filePath = path.join(inputDir, inputFiles[i]); // נתיב הקובץ

      if (fs.existsSync(filePath)) {
        const lines = await readLinesFromFile(filePath, numLines);
        fs.appendFileSync(outputFile, lines.join("\n") + "\n");
      } else {
        console.warn(`File not found: ${inputFiles[i]}`);
      }
    }

    console.log(`Merged content written to ${outputFile}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// הפעלת הפונקציה הראשית
mergeFiles();
