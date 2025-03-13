using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SkiaSharp;
using SuperAniki.Laggen.Models;

namespace SuperAniki.Laggen.Utilities
{
    public static class CanvasTools
    {
        public static void DrawInfoText(SKCanvas canvas, string text, int textSize, int angle, int x, int y)
        {
            // Load the Liberation font
            //using var typeface = SKTypeface.FromFile("path/to/LiberationSans-Regular.ttf");

            // Create the paint object
            using var paint = new SKPaint
            {
                TextSize = textSize,
                Color = SKColors.Black,
                IsAntialias = true,
                Style = SKPaintStyle.Fill,
                StrokeWidth = 1,
            };

            // Save the current canvas state
            canvas.Save();

            // Rotate the canvas 90 degrees around the point (x, y)
            canvas.RotateDegrees(angle, x, y);

            // Draw the text at the specified position
            canvas.DrawText(text, x, y, paint);

            // Restore the canvas to its previous state
            canvas.Restore();
        }

        public static void DrawPath(SKCanvas canvas, double x, double y, double[] points, SKPaint? _paint = null, bool closedPath = false)
        {
            using (var path = new SKPath())
            {
                path.MoveTo((float)(points[0] + x), (float)(points[1] + y)); // Move to the first point

                // Iterate over the vector and draw line segments
                for (int i = 2; i < points.Length; i += 2)
                {
                    path.LineTo((float)(points[i] + x), (float)(points[i + 1] + y)); // Draw line to next point
                }

                if (closedPath)
                {
                    path.Close(); // Close the path to connect the last point to the first
                }

                SKPaint paint = new();
                if (_paint != null)
                {
                    paint = _paint;
                }
                else
                {
                    paint.Style = SKPaintStyle.Stroke;
                    paint.StrokeWidth = 1;
                }

                paint.IsAntialias = true;
                canvas.DrawPath(path, paint);
            }
        }
        /*
                public static void DrawCurve(SKCanvas canvas, double x, double y, double[] points, string title)
                {
                    DrawPath(canvas, x, y, points);
                    using (var paint = new SKPaint { Color = SKqColors.Black, TextSize = 6 * 96.0f / 72.0f })
                    {
                        canvas.DrawText(title, x + 4.5f, y - 6f, paint);
                    }
                }*/

        public static void DrawBarrelSide(SKCanvas canvas, float x, float y, BarrelDetails barrelDetails, float scale)
        {
            var (height, angle, bottomDiameter, staveBottomThickness, staveTopThickness, bottomThickness, bottomMargin) = barrelDetails;


            var tan = (float)Math.Tan(angle * Math.PI / 180);
            var length = tan * height; // position till motsatt sida av vinkeln
            var hypotenusaLength = (float)Math.Sqrt((height * height) + (length * length));
            var outlinePoints = new[] { 0f, 0f, -length, -height, bottomDiameter + length, -height, bottomDiameter, 0f };
            var leftStavePoints = new[] { 0f, 0f, 0f, -hypotenusaLength, staveTopThickness, -hypotenusaLength, staveBottomThickness, 0f };
            var rightStavePoints = new[] { 0f, 0f, 0f, -hypotenusaLength, -staveTopThickness, -hypotenusaLength, -staveBottomThickness, 0f };
            var angleLength = (tan * bottomMargin) - (staveBottomThickness - 5); // angle-dependent extra length to plate
            var bottomPlantePoints = new[] { 0 + angleLength, 0f, 0 + angleLength, -bottomThickness, -bottomDiameter - angleLength, -bottomThickness, -bottomDiameter - angleLength, 0f };

            canvas.Translate(x, y);
            canvas.Scale(scale, scale);
            //canvas.LineWidth = 1;

            DrawPath(canvas, -bottomDiameter - length, 0, outlinePoints);
            canvas.Save();
            canvas.Translate((float)(-bottomDiameter - length), 0);
            canvas.RotateDegrees((float)-angle);

            DrawPath(canvas, 0, 0, leftStavePoints);
            canvas.Restore();

            canvas.Save();
            canvas.Translate((float)-length, 0);
            canvas.RotateDegrees((float)angle);
            DrawPath(canvas, 0, 0, rightStavePoints);
            canvas.Restore();

            DrawPath(canvas, -length, -bottomMargin, bottomPlantePoints);
        }


        public static void DrawStaveEnds(SKCanvas canvas, float x, float y, BarrelDetails barrelDetails, StaveEndConfigDetail config)
        {
            DrawInfoText(canvas, "Test test DrawStaveEnds", 4, 45, 15, 15);

            var (height, angle, bottomDiameter, staveBottomThickness, staveTopThickness, _, _) = barrelDetails;

            double tan = Math.Tan((angle * Math.PI) / 180);
            double length = tan * height; // position till motsatt sida av vinkeln
            double topOuterDiameter = length * 2 + bottomDiameter;
            double bottomOuterDiameter = bottomDiameter;

            double adjustedBottomOuterDiameter = BarrelMath.FindAdjustedDiameter(bottomOuterDiameter, angle);
            double adjustedBottomInnerDiameter = adjustedBottomOuterDiameter - staveBottomThickness * 2;
            double adjustedTopOuterDiameter = BarrelMath.FindAdjustedDiameter(topOuterDiameter, angle);
            double adjustedTopInnerDiameter = adjustedTopOuterDiameter - staveTopThickness * 2;

            double[] bottomPoints = BarrelMath.CreateCurveForStaveEnds(adjustedBottomInnerDiameter, 90, 270, staveBottomThickness);
            double[] bottomEndPoints = [.. BarrelMath.CreateCurveForStaveEnds(adjustedBottomOuterDiameter, 90, 270, 0), .. BarrelMath.ReversePairs(bottomPoints)];
            double[] topPoints = BarrelMath.CreateCurveForStaveEnds(adjustedTopInnerDiameter, 90, 270, staveTopThickness);
            double[] topEndPoints = [.. BarrelMath.CreateCurveForStaveEnds(adjustedTopOuterDiameter, 90, 270, 0), .. BarrelMath.ReversePairs(topPoints)];




            canvas.Save();
            canvas.Translate((float)x, (float)y);
            DrawPath(canvas, 0, config.TopEndY, topEndPoints, closedPath: true);
            DrawPath(canvas, 0, config.BottomEndY, bottomEndPoints, closedPath: true);

            using (var textPaint = new SKPaint { Color = SKColors.Black, TextSize = 6 * 96.0f / 72.0f })
            {
                canvas.DrawText("Top Ends", 4.5f, (float)config.TopEndY - 4, textPaint);
                canvas.DrawText("Bottom Ends", 4.5f, (float)config.BottomEndY - 4, textPaint);
            }

            canvas.Restore();



            /*

            ctx.fillStyle = 'black';
            ctx.font = "6pt 'Liberation'";
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'black';

            ctx.save();
            ctx.translate(x, y);
            drawPath(ctx, 0, configDetails.topEndY, topEndPoints, true);
            ctx.fillText('Top Ends', 4.5, configDetails.topEndY - 4);
            drawPath(ctx, 0, configDetails.bottomEndY, bottomEndPoints, true);
            ctx.fillText('Bottom Ends', 4.5, configDetails.bottomEndY - 4);
            ctx.restore();
            */

        }



        /*
const { angle, height, bottomDiameter, staveBottomThickness, staveTopThickness } = { ...barrelDetails };
const configDetailsArray = config.configDetails;

const configDetails = configDetailsArray.find((item) => item.paperType === paperState);
if (configDetails === undefined) return ctx;

const tan = Math.tan((angle * Math.PI) / 180);
const length = tan * height; // position till motsatt sida av vinkeln
const topOuterDiameter = length * 2 + bottomDiameter;
const bottomOuterDiameter = bottomDiameter;

const adjustedBottomOuterDiameter = findAdjustedDiameter(bottomOuterDiameter, angle);
const adjustedBottomInnerDiameter = adjustedBottomOuterDiameter - staveBottomThickness * 2;
const adjustedTopOuterDiameter = findAdjustedDiameter(topOuterDiameter, angle);
const adjustedTopInnerDiameter = adjustedTopOuterDiameter - staveTopThickness * 2;

const bottomPoints = createCurveForStaveEnds(adjustedBottomInnerDiameter, 90, 270, staveBottomThickness);
const bottomEndPoints = [
    ...createCurveForStaveEnds(adjustedBottomOuterDiameter, 90, 270, 0),
    ...reversePairs(bottomPoints),
];

const topPoints = createCurveForStaveEnds(adjustedTopInnerDiameter, 90, 270, staveTopThickness);
const topEndPoints = [...createCurveForStaveEnds(adjustedTopOuterDiameter, 90, 270, 0), ...reversePairs(topPoints)];

ctx.fillStyle = 'black';
ctx.font = "6pt 'Liberation'";
ctx.lineWidth = 4;
ctx.strokeStyle = 'black';

ctx.save();
ctx.translate(x, y);
drawPath(ctx, 0, configDetails.topEndY, topEndPoints, true);
ctx.fillText('Top Ends', 4.5, configDetails.topEndY - 4);
drawPath(ctx, 0, configDetails.bottomEndY, bottomEndPoints, true);
ctx.fillText('Bottom Ends', 4.5, configDetails.bottomEndY - 4);
ctx.restore();

        */



        public class TextData
        {
            public double X { get; set; }
            public double Y { get; set; }
            public string Text { get; set; }
        }

        public class StaveTemplatePointsResult
        {
            public List<double[]> Points { get; set; }
            public List<TextData> TextData { get; set; }
        }

        public static StaveTemplatePointsResult CalcStaveTemplatePoints(double topDiameter, double bottomDiameter, double staveLength, double spacing)
        {
            double mmPerSizeChange = spacing;
            double mmPerSizeChangeBottom = bottomDiameter / topDiameter * mmPerSizeChange;
            var points = new List<double[]>();
            var textData = new List<TextData>();

            double diaBottom = bottomDiameter;
            int count = 1;

            for (double diaTop = topDiameter; diaTop >= 0 && diaBottom >= 0; diaTop -= mmPerSizeChange)
            {
                points.Add([-diaBottom * 0.5, 0, -diaTop * 0.5, -staveLength, diaTop * 0.5, -staveLength, diaBottom * 0.5, 0]);
                textData.Add(new TextData { X = -diaTop * 0.5, Y = -staveLength, Text = count.ToString() });
                textData.Add(new TextData { X = diaTop * 0.5, Y = -staveLength, Text = count.ToString() });
                count++;
                diaBottom -= mmPerSizeChangeBottom;
            }

            return new StaveTemplatePointsResult { Points = points, TextData = textData };
        }

        public static void DrawCurve(SKCanvas canvas, double x, double y, double[] points, string title)
        {
            DrawPath(canvas, x, y, points);

            using (var textPaint = new SKPaint { Color = SKColors.Black, TextSize = 6 * 96.0f / 72.0f })
            {
                canvas.DrawText(title, (float)(x + 4.5), (float)y - 6, textPaint);
            }
        }

        public static void DrawStaveCurve(SKCanvas canvas, BarrelDetails barrelDetails, StaveCurveConfigDetail config)
        {
            DrawInfoText(canvas, "Test test DrawStaveCurve", 4, 45, 15, 15);
            var (height, angle, bottomDiameter, staveBottomThickness, staveTopThickness, _, _) = barrelDetails;
            var (posX, posY, innerTopY, outerTopY, innerBottomY, outerBottomY, rectX, rectY, rectWidth, rectHeight) = config;


            double tan = Math.Tan((angle * Math.PI) / 180);
            double length = tan * height; // position till motsatt sida av vinkeln
            double topOuterDiameter = length * 2 + bottomDiameter;
            double bottomOuterDiameter = bottomDiameter;

            double adjustedBottomOuterDiameter = BarrelMath.FindAdjustedDiameter(bottomOuterDiameter, angle);
            double adjustedBottomInnerDiameter = adjustedBottomOuterDiameter - staveBottomThickness * 2;
            double adjustedTopOuterDiameter = BarrelMath.FindAdjustedDiameter(topOuterDiameter, angle);
            double adjustedTopInnerDiameter = adjustedTopOuterDiameter - staveTopThickness * 2;

            double maxStaveWidth = 100;

            double[] adjustedBottomOuterPoints = BarrelMath.CreateCurveMaxWidth(adjustedBottomOuterDiameter, 90, 180, maxStaveWidth);
            double[] adjustedBottomInnerPoints = BarrelMath.CreateCurveMaxWidth(adjustedBottomInnerDiameter, 90, 180, maxStaveWidth);
            double[] adjustedTopOuterPoints = BarrelMath.CreateCurveMaxWidth(adjustedTopOuterDiameter, 90, 180, maxStaveWidth);
            double[] adjustedTopInnerPoints = BarrelMath.CreateCurveMaxWidth(adjustedTopInnerDiameter, 90, 180, maxStaveWidth);

            double curveXpos = rectX + rectWidth;

            canvas.Save();
            canvas.Translate((float)posX, (float)posY);

            DrawCurve(canvas, curveXpos, outerBottomY, adjustedBottomOuterPoints, "Bottom, outer");
            DrawCurve(canvas, curveXpos, innerBottomY, adjustedBottomInnerPoints, "Bottom, inner");
            DrawCurve(canvas, curveXpos, outerTopY, adjustedTopOuterPoints, "Top, outer");
            DrawCurve(canvas, curveXpos, innerTopY, adjustedTopInnerPoints, "Top, inner");

            using (var paint = new SKPaint { Style = SKPaintStyle.Stroke, Color = SKColors.Black, StrokeWidth = 1 })
            {
                canvas.DrawRect((float)rectX, (float)rectY, (float)rectWidth, (float)rectHeight, paint);
            }
            canvas.Restore();
        }


        public static void DrawStaveFront(SKCanvas canvas, float x, float y, BarrelDetails barrelDetails, StaveFrontConfigDetail config)
        {
            DrawInfoText(canvas, "DrawStaveFront", 4, 45, 15, 15);

            var (name, height, bottomDiameter, topDiameter, staveLength, angle) = barrelDetails;

            var pointsData = CalcStaveTemplatePoints(topDiameter, bottomDiameter, staveLength, config.Spacing);

            canvas.Save();
            canvas.Translate(x, (float)config.PosY);

            var paintFill = new SKPaint { Style = SKPaintStyle.Fill, Color = SKColors.LightGray, StrokeWidth = 0 };
            {
                DrawPath(canvas, 0, 0, pointsData.Points[0], paintFill, true);
            }

            using (var paintStroke = new SKPaint { Style = SKPaintStyle.Stroke, Color = SKColors.Black, StrokeWidth = 0.25f })
            {
                foreach (var element in pointsData.Points)
                {
                    DrawPath(canvas, 0, 0, element, paintStroke, true);
                }
            }

            using (var textPaint = new SKPaint { Color = SKColors.Black, TextSize = 2.5f })
            {
                foreach (var element in pointsData.TextData)
                {
                    canvas.DrawText(element.Text, (float)element.X - 2, (float)element.Y - 6, textPaint);
                }
            }

            canvas.Restore();

        }
    }
}
