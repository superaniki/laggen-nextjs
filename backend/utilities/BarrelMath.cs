using System;
using SuperAniki.Laggen.Models;

namespace SuperAniki.Laggen.Utilities
{
  public static class BarrelMath
  {
    public static double FindDiameter(double oldDiameter, double x2, double y2)
    {
      const double diameterStep = 0.1;
      double testDiameter = oldDiameter;
      double foundAngle = 0;
      double yTest = -oldDiameter * Math.Cos((Math.PI * 2 * 180) / 360);

      int count = 0;

      while (yTest > y2 && yTest > 0 && count < 10000)
      {
        count++;
        double xTest = 0;
        for (int i = 180; i > 90; i--)
        {
          xTest = testDiameter * 0.5 * Math.Sin((Math.PI * 2 * i) / 360);
          if (xTest >= x2)
          {
            foundAngle = i;
            break;
          }
        }

        yTest = testDiameter * 0.5 * Math.Cos((Math.PI * 2 * foundAngle) / 360) + testDiameter * 0.5;
        if (yTest < y2)
        {
          break;
        }
        testDiameter += diameterStep;
      }

      return testDiameter;
    }

    public static double[] CalcCirclePosition(double radius, double angle, double yAdjust)
    {
      double x = radius * Math.Sin((Math.PI * 2 * angle) / 360);
      double y = radius * Math.Cos((Math.PI * 2 * angle) / 360);
      return new double[] { Math.Round(x, 8), Math.Round(y + yAdjust, 8) };
    }

    public static double[] GetCorrectedEndPoints(double[] points, double angle)
    {
      double procentToRemove = 100 * Math.Sin((Math.PI * 2 * angle) / 360) * 0.01;
      double x = points[points.Length - 2];
      double y = points[points.Length - 1] - points[points.Length - 1] * procentToRemove;
      return new double[] { x, y };
    }

    public static double FindAdjustedDiameter(double diameter, double angle)
    {
      double[] points = CreateCurveMaxWidth(diameter, 90, 180);
      double[] adjustedEndPoints = GetCorrectedEndPoints(points, angle);
      return FindDiameter(diameter, adjustedEndPoints[0], adjustedEndPoints[1]);
    }

    /*function reversePairs(arr: number[])
    {
      return arr.map((_, i) => arr[arr.length - i - 2 * (1 - (i % 2))]);
    }*/

    public static double[] ReversePairs(double[] arr)
    {
      double[] result = new double[arr.Length];

      for (int i = 0; i < arr.Length; i++)
      {
        result[i] = arr[(int)(arr.Length - i - 2 * (1 - (i % 2)))];
      }

      return result;
    }


    public static double[] CreateCurveMaxWidth(double diameter, int min, int max, double maxStaveWidth = 999999)
    {
      double radius = diameter * 0.5;
      double[] points = new double[] { };
      for (int i = max; i >= min; i--)
      {
        double[] circlePosition = CalcCirclePosition(radius, i, radius);
        points = points.Concat(circlePosition).ToArray();
        if (points[points.Length - 2] > maxStaveWidth) break;
      }
      return points;
    }

    public static double[] CreateCurveForStaveEnds(double diameter, int min, int max, double adjust)
    {
      double radius = diameter * 0.5;
      double[] points = new double[] { };
      for (int i = max; i >= min; i--)
      {
        double[] circlePosition = CalcCirclePosition(radius, i, radius + adjust);
        points = points.Concat(circlePosition).ToArray();
      }
      return points;
    }

    public static double HypoCalc(double height, double adjacent)
    {
      return Math.Sqrt(height * height + adjacent * adjacent);
    }

    public static double CalcStaveLength(double angle, double height)
    {
      double tan = Math.Tan(ToRadians(angle));
      double adjacent = tan * height;
      double hypotenusaLength = HypoCalc(height, adjacent);
      return hypotenusaLength;
    }

    public static double ToRadians(double angle)
    {
      return (angle * Math.PI) / 180;
    }

    public static double CalcBarrelHeight(double angle, double staveLength)
    {
      return Math.Cos(ToRadians(angle)) * staveLength;
    }

    public static double CalculateAngle(double topDiameter, double bottomDiameter, double height)
    {
      double adjacent = (topDiameter - bottomDiameter) * 0.5;
      double hypotenusa = HypoCalc(height, adjacent);
      return Math.Asin(adjacent / hypotenusa) * (180 / Math.PI);
    }

    public static double Round(double value, int numberOfDecimals = 2)
    {
      return Math.Round(value * Math.Pow(10, numberOfDecimals)) / Math.Pow(10, numberOfDecimals);
    }

    public static BarrelDetails ApplyBarrelHeight(double newHeight, BarrelDetails barrel)
    {
      double newAngle = CalculateAngle(barrel.TopDiameter, barrel.BottomDiameter, newHeight);
      double tan = Math.Tan(ToRadians(newAngle));
      double adjacent = tan * newHeight;
      double hypotenusaLength = HypoCalc(newHeight, adjacent);

      return new BarrelDetails
      {
        TopDiameter = barrel.TopDiameter,
        BottomDiameter = barrel.BottomDiameter,
        StaveLength = Round(hypotenusaLength),
        Height = newHeight,
        Angle = Round(newAngle)
      };
    }

    public static BarrelDetails ApplyBarrelStaveLength(double newStaveLength, BarrelDetails barrel, bool topDiameterLocked = false)
    {
      if (barrel.Angle == null || barrel.StaveLength == null) return barrel;

      double newAdjacent = newStaveLength * Math.Sin(ToRadians((double)barrel.Angle));
      double newHeight = Round(newStaveLength * Math.Cos(ToRadians((double)barrel.Angle)));

      if (topDiameterLocked)
      {
        double oldAdjacent = (double)barrel.StaveLength * Math.Sin(ToRadians((double)barrel.Angle));
        double diff = oldAdjacent - newAdjacent;
        double newBottomDiameter = Round(barrel.BottomDiameter + diff * 2);

        return new BarrelDetails
        {
          TopDiameter = barrel.TopDiameter,
          BottomDiameter = newBottomDiameter,
          StaveLength = newStaveLength,
          Height = newHeight
        };
      }

      double newTopDiameter = Round(barrel.BottomDiameter + newAdjacent * 2);
      return new BarrelDetails
      {
        TopDiameter = newTopDiameter,
        BottomDiameter = barrel.BottomDiameter,
        StaveLength = newStaveLength,
        Height = newHeight
      };
    }

    public static BarrelDetails ApplyBarrelBottomDiameter(double newBottomDiameter, BarrelDetails barrel)
    {
      double newAngle = Round(CalculateAngle(barrel.TopDiameter, newBottomDiameter, barrel.Height), 2);
      double newStaveLength = Round(CalcStaveLength(newAngle, barrel.Height), 2);

      return new BarrelDetails
      {
        TopDiameter = barrel.TopDiameter,
        BottomDiameter = newBottomDiameter,
        StaveLength = newStaveLength,
        Angle = newAngle
      };
    }

    public static BarrelDetails ApplyBarrelTopDiameter(double newTopDiameter, BarrelDetails barrel)
    {
      double newAngle = Round(CalculateAngle(newTopDiameter, barrel.BottomDiameter, barrel.Height));
      double newStaveLength = Round(CalcStaveLength(newAngle, barrel.Height));

      return new BarrelDetails
      {
        TopDiameter = newTopDiameter,
        BottomDiameter = barrel.BottomDiameter,
        StaveLength = newStaveLength,
        Angle = newAngle
      };
    }

    public static BarrelDetails ApplyBarrelAngle(double newAngle, BarrelDetails barrel, bool topDiameterLocked = false)
    {
      double newHeight = CalcBarrelHeight(newAngle, (double)barrel.StaveLength);
      double tan = Math.Tan(newAngle * (Math.PI / 180));
      double newAdjacent = tan * newHeight;
      double oldAdjacent = (double)barrel.StaveLength * Math.Sin(ToRadians((double)barrel.Angle));
      double diff = oldAdjacent - newAdjacent;
      double newBottomDiameter = barrel.BottomDiameter + diff * 2;

      if (topDiameterLocked)
      {
        return new BarrelDetails
        {
          TopDiameter = barrel.TopDiameter,
          BottomDiameter = newBottomDiameter,
          StaveLength = barrel.StaveLength,
          Height = newHeight,
          Angle = newAngle
        };
      }

      double newTopDiameter = barrel.BottomDiameter + newAdjacent * 2;
      return new BarrelDetails
      {
        TopDiameter = newTopDiameter,
        BottomDiameter = barrel.BottomDiameter,
        StaveLength = barrel.StaveLength,
        Height = newHeight,
        Angle = newAngle
      };
    }

    public static double FindScaleToFit((double width, double height) view, (double width, double height) obj, double margins)
    {
      double scale = 1;
      if (obj.width > view.width || obj.height > view.height)
      {
        double scaleWidth = margins * view.width / obj.width;
        double scaleHeight = margins * view.height / obj.height;
        scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight;
      }
      else
      {
        double scaleWidth = margins * view.width / obj.width;
        double scaleHeight = margins * view.height / obj.height;
        scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight;
      }
      return scale;
    }
  }
}

/*
  public class BarrelDetails
  {
    public double TopDiameter { get; set; }
    public double BottomDiameter { get; set; }
    public double? StaveLength { get; set; }
    public double Height { get; set; }
    public double? Angle { get; set; }
  }
}
*/
