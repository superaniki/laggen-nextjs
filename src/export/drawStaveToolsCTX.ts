import { BarrelExportData } from "@/app/api/barrels/export/route";
import { drawBarrelSideCTX, drawInfoTextCTX, drawRulerCTX, drawStaveCurveCTX, drawStaveEndsCTX, drawStaveFrontCTX } from "@/export/toolTemplatesCTX";
import { PaperSizes } from "@/common/constants";
import { Paper, StaveTool } from "@/common/enums";
import { StaveCurveConfigDetails, StaveEndConfigDetails, StaveFrontConfigDetails } from "@prisma/client";
import * as PImage from "pureimage";
import fs from 'fs';
import path from 'path';


// Function to list files in the current directory
function listFilesInCurrentDirectory( path:string) {
  // Read the current directory
  fs.readdir(path, (err, files) => {
      if (err) {
          console.error('Error reading directory:', err);
          return;
      }

      // Print each file in the directory
      console.log('Files in the current directory:');
      files.forEach(file => {
          console.log(file);
      });
  });
}

function throughDirectory(directory : string) {
  let files  = [];
  
  fs.readdirSync(directory).forEach(file => {
      const absolute = path.join(directory, file);
      if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute);
      else{
        console.log(absolute)
      } 
  });
}

export function createStaveToolsPImage(barrelExportData : BarrelExportData){
  const {barrelDetails, staveToolState, staveCurveConfig, staveEndConfig, staveFrontConfig} = {...barrelExportData}

  let config: any;
  let configDetailsDataArray: StaveCurveConfigDetails[] | StaveEndConfigDetails[] | StaveFrontConfigDetails[];
  let configDetails: any;
  switch (staveToolState) {
    case StaveTool.Curve:
      config = staveCurveConfig;
      configDetailsDataArray = config.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));
      break;
    case StaveTool.End:
      config = staveEndConfig;
      configDetailsDataArray = config.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));
      break;
    case StaveTool.Front:
      config = staveFrontConfig;
      configDetailsDataArray = config.configDetails as StaveFrontConfigDetails[];
      configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));
      break;
  }

  const { height, angle, topDiameter, staveLength, bottomDiameter } = { ...barrelDetails };

  if (configDetails === undefined)
    return;

  let paperHeight = PaperSizes[config.defaultPaperType as Paper].height;
  let paperWidth = PaperSizes[config.defaultPaperType as Paper].width;

  if (configDetails.rotatePaper) {
    paperWidth = PaperSizes[config.defaultPaperType as Paper].height;
    paperHeight = PaperSizes[config.defaultPaperType as Paper].width;
  }

  const scale = 8;
  const bitmap = PImage.make(paperWidth * scale, paperHeight * scale);

  const ctx = bitmap.getContext('2d');
  ctx.scale(scale, scale);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, paperWidth, paperHeight);

  //console.log("EXPORT, 'process.cwd()': "+process.cwd())
  //console.log("EXPORT, '__dirname': "+__dirname)

  //const directoryPath = path.join(__dirname, '.next/server/');
  //const directoryPath = path.join(process.cwd(), '.next/server/');
  //const directoryPathRoot = path.join(process.cwd(), '');

  //Call the function to list files
  //listFilesInCurrentDirectory(directoryPath);
  //throughDirectory(directoryPathRoot);
  //console.log("2")
  //listFilesInCurrentDirectory(directoryPath2);

  var fnt = PImage.registerFont(
    "./src/fonts/LiberationSans-Regular.ttf",
    "Liberation",
  );
  fnt.loadSync();
  const margins = 15;
  const rulerMargin = 10

  let staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
    "  Stave length: " + staveLength + "  Angle: " + angle;

  switch (staveToolState) {
    case StaveTool.Curve:
      drawStaveCurveCTX(ctx, config.defaultPaperType as Paper, barrelDetails, config)
      break;
    case StaveTool.End:
      drawStaveEndsCTX(ctx, paperWidth * 0.5, paperHeight, barrelDetails, config, config.defaultPaperType as Paper)
      break;
    case StaveTool.Front:
      drawStaveFrontCTX(ctx, paperWidth * 0.5, margins, barrelDetails, config, config.defaultPaperType as Paper)
      break;
  }

  drawInfoTextCTX(ctx, staveTemplateInfoText, -90, -paperHeight + 23, margins + 4)
  drawInfoTextCTX(ctx, barrelDetails.name, 0, 10, 10)
  drawRulerCTX(ctx, 10, rulerMargin, paperHeight - (rulerMargin * 2), 6, 0, rulerMargin);
  drawBarrelSideCTX(ctx, paperWidth - margins, paperHeight - margins, barrelDetails, 0.07);

  return bitmap;
}