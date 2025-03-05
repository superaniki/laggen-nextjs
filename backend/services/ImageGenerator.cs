/*
using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
*/
using Microsoft.Extensions.Logging;
using SkiaSharp;
using SuperAniki.Laggen.Models;
using SuperAniki.Laggen.Utilities;

namespace SuperAniki.Laggen.Services
{
  public static class ImageGenerator
  {

    // Define the dictionary to map Paper enum values to their corresponding sizes
    public static readonly Dictionary<string, int[]> PaperSizes = new Dictionary<string, int[]>
        {
            { "A3", [297, 420] },
            { "A4", [210, 297] }
        };

    private static bool GetBarrelDetails(StaveTool type, Barrel barrel, out IConfigDetails? config)
    {
      IStaveConfig staveConfig;
      IConfigDetails[] configArray;
      switch (type)
      {
        case StaveTool.Curve:
          staveConfig = barrel.StaveCurveConfig!;
          configArray = barrel.StaveCurveConfig!.ConfigDetails!;
          break;
        case StaveTool.End:
          staveConfig = barrel.StaveEndConfig!;
          configArray = barrel.StaveEndConfig!.ConfigDetails!;

          break;
        case StaveTool.Front:
          staveConfig = barrel.StaveFrontConfig!;
          configArray = barrel.StaveFrontConfig!.ConfigDetails!;
          break;
        default:
          config = null;
          return false;
      }

      // Hämtar rätt config beroende på pappersstorlek
      config = configArray!.Where(c => c.PaperType == staveConfig.DefaultPaperType!).First();
      return true;
    }
    public static void GetPaperSize(string paperType, bool rotate, out int width, out int height)
    {
      int[] paperSize = PaperSizes[paperType];
      if (rotate)
      {
        width = paperSize[1];
        height = paperSize[0];
      }
      else
      {
        width = paperSize[0];
        height = paperSize[1];
      }
    }

    public static double MmToPixels(double widthMm, double dpi)
    {
      double scaleFactor = dpi / 25.4;
      double widthPixels = widthMm * scaleFactor;
      return widthPixels;
    }

    public static MemoryStream? Draw(Barrel barrel, int dpi, string format, ILogger logger)
    {
      StaveTool toolState = barrel.StaveToolState;
      if (!GetBarrelDetails(toolState, barrel, out IConfigDetails? config))
      {
        logger.LogError("Error extracting barrel details");
        return null;
      }

      GetPaperSize(config!.PaperType!, config!.RotatePaper, out int paperWidth, out int paperHeight);
      float scale = (float)(dpi / 25.4); // make dpi into scale factor for pixels

      int imageWidth = Convert.ToInt32(paperWidth * scale);
      int imageHeight = Convert.ToInt32(paperHeight * scale);
      int margins = 15;

      using (var bitmap = new SKBitmap(imageWidth, imageHeight))
      {
        // Create a canvas to draw on the bitmap
        using (var canvas = new SKCanvas(bitmap))
        {
          // Set the background color
          canvas.Scale(scale);
          canvas.Clear(SKColors.Beige);

          //drawing of specialized templates here
          switch (toolState)
          {
            case StaveTool.Curve:
              CanvasTools.DrawStaveCurve(canvas, barrel!.BarrelDetails!, (StaveCurveConfigDetail)config);
              break;
            case StaveTool.End:
              CanvasTools.DrawStaveEnds(canvas, paperWidth * 0.5f, paperHeight, barrel.BarrelDetails!, (StaveEndConfigDetail)config);
              break;
            case StaveTool.Front:
              CanvasTools.DrawStaveFront(canvas, paperWidth * 0.5f, margins, barrel.BarrelDetails!, (StaveFrontConfigDetail)config);
              break;
          }

          var (name, height, angle, topDiameter, staveLength, bottomDiameter) = barrel.BarrelDetails!;
          var staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
      "  Stave length: " + staveLength + "  Angle: " + angle;

          CanvasTools.DrawInfoText(canvas, staveTemplateInfoText, 3, 270, margins, paperHeight - 25);
          CanvasTools.DrawInfoText(canvas, name, 4, 0, 10, 10);
          CanvasTools.DrawBarrelSide(canvas, paperWidth - margins, paperHeight - margins, barrel.BarrelDetails, 0.07f);
        }

        SKEncodedImageFormat imageFormat = SKEncodedImageFormat.Png;
        int imageQuality = 100;
        switch (format.ToLower())
        {
          case "png":
            imageFormat = SKEncodedImageFormat.Png;
            imageQuality = 100;
            break;
          case "jpeg":
            imageFormat = SKEncodedImageFormat.Jpeg;
            imageQuality = 95;
            break;
          default:
            imageFormat = SKEncodedImageFormat.Png;
            break;
        }

        using (var image = SKImage.FromBitmap(bitmap))
        using (var data = image.Encode(imageFormat, imageQuality))
        {
          MemoryStream memoryStream = new();
          data.SaveTo(memoryStream);
          memoryStream.Seek(0, SeekOrigin.Begin); // Reset the stream position to the beginning
          return memoryStream;
        }
      }
    }


    public static MemoryStream? Draw_SkiaSharp_Example(Barrel barrel, float scale, ILogger logger)
    {
      // Define the image dimensions
      int width = 800;
      int height = 600;

      // Create an empty bitmap with the specified dimensions
      using (var bitmap = new SKBitmap(width, height))
      {
        // Create a canvas to draw on the bitmap
        using (var canvas = new SKCanvas(bitmap))
        {
          // Set the background color
          canvas.Clear(SKColors.White);

          // Draw a rectangle
          var paint = new SKPaint
          {
            Color = SKColors.Blue,
            IsAntialias = true,
            Style = SKPaintStyle.Stroke,
            StrokeWidth = 3
          };

          canvas.DrawRect(new SKRect(100, 100, 700, 500), paint);

          // Draw a circle
          paint.Color = SKColors.Red;
          canvas.DrawCircle(400, 300, 100, paint);

          // Draw some text
          paint.Color = SKColors.Green;
          paint.TextSize = 50;
          canvas.DrawText("Hello SkiaSharp", 200, 100, paint);

          // Draw a line
          paint.Color = SKColors.Black;
          canvas.DrawLine(100, 100, 700, 500, paint);
        }

        // Save the bitmap as a PNG file
        using (var image = SKImage.FromBitmap(bitmap))
        using (var data = image.Encode(SKEncodedImageFormat.Png, 100))
        {
          MemoryStream memoryStream = new();
          data.SaveTo(memoryStream);
          memoryStream.Seek(0, SeekOrigin.Begin); // Reset the stream position to the beginning
          return memoryStream;


          // using (var fileStream = new FileStream("output.png", FileMode.Create, FileAccess.Write))
          // {
          //   memoryStream.CopyTo(fileStream);
          // }

        }

      }

    }
  }
}