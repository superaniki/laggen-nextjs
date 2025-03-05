
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;


namespace SuperAniki.Laggen.Models
{
    public enum StaveTool
    {
        Curve,
        Front,
        End
    }
    public class Barrel
    {
        [JsonProperty("staveToolState")]
        public StaveTool StaveToolState { get; set; }

        [JsonProperty("staveCurveConfig")]
        public StaveCurveConfig? StaveCurveConfig { get; set; }

        [JsonProperty("staveEndConfig")]
        public StaveEndConfig? StaveEndConfig { get; set; }

        [JsonProperty("staveFrontConfig")]
        public StaveFrontConfig? StaveFrontConfig { get; set; }

        [JsonProperty("barrelDetails")]
        public BarrelDetails? BarrelDetails { get; set; }
    }

    public class BarrelDetails
    {
        [JsonProperty("id")]
        public string? Id { get; set; }

        [JsonProperty("name")]
        public string? Name { get; set; }

        [JsonProperty("notes")]
        public string? Notes { get; set; }

        [JsonProperty("height")]
        public double Height { get; set; }

        [JsonProperty("bottomDiameter")]
        public double BottomDiameter { get; set; }

        [JsonProperty("topDiameter")]
        public double TopDiameter { get; set; }

        [JsonProperty("staveLength")]
        public double StaveLength { get; set; }

        [JsonProperty("angle")]
        public double Angle { get; set; }

        [JsonProperty("staveBottomThickness")]
        public double StaveBottomThickness { get; set; }

        [JsonProperty("staveTopThickness")]
        public double StaveTopThickness { get; set; }

        [JsonProperty("bottomThickness")]
        public double BottomThickness { get; set; }

        [JsonProperty("bottomMargin")]
        public double BottomMargin { get; set; }

        [JsonProperty("isPublic")]
        public bool IsPublic { get; set; }

        [JsonProperty("isExample")]
        public bool IsExample { get; set; }

        [JsonProperty("barrelId")]
        public string? BarrelId { get; set; }

        public void Deconstruct(out double height, out double angle, out double bottomDiameter, out double staveBottomThickness, out double staveTopThickness,
        out double bottomThickness, out double bottomMargin)
        {
            height = Height;
            angle = Angle;
            bottomDiameter = BottomDiameter;
            staveBottomThickness = StaveBottomThickness;
            staveTopThickness = StaveTopThickness;
            bottomThickness = BottomThickness;
            bottomMargin = BottomMargin;
        }

        public void Deconstruct(out string name, out double height, out double bottomDiameter,
                               out double topDiameter, out double staveLength, out double angle)
        {
            name = Name;
            height = Height;
            bottomDiameter = BottomDiameter;
            topDiameter = TopDiameter;
            staveLength = StaveLength;
            angle = Angle;
        }

        public void Deconstruct(out string? id, out string? name, out string? notes, out double height, out double bottomDiameter,
                               out double topDiameter, out double staveLength, out double angle, out double staveBottomThickness,
                               out double staveTopThickness, out double bottomThickness, out double bottomMargin, out bool isPublic,
                               out bool isExample, out string? barrelId)
        {
            id = Id;
            name = Name;
            notes = Notes;
            height = Height;
            bottomDiameter = BottomDiameter;
            topDiameter = TopDiameter;
            staveLength = StaveLength;
            angle = Angle;
            staveBottomThickness = StaveBottomThickness;
            staveTopThickness = StaveTopThickness;
            bottomThickness = BottomThickness;
            bottomMargin = BottomMargin;
            isPublic = IsPublic;
            isExample = IsExample;
            barrelId = BarrelId;
        }
    }

    public interface IStaveConfig
    {
        public string? Id { set; get; }
        public string? DefaultPaperType { set; get; }
        public string? BarrelId { set; get; }
        // public IConfigDetails[]? ConfigDetails { get; set; }
    }


    public interface IConfigDetails
    {
        public string? Id { get; set; }
        public string? PaperType { get; set; }
        public bool RotatePaper { get; set; }
    }

    public class StaveCurveConfig : IStaveConfig
    {
        [JsonProperty("id")]
        public string? Id { get; set; }

        [JsonProperty("defaultPaperType")]
        public string? DefaultPaperType { get; set; }

        [JsonProperty("barrelId")]
        public string? BarrelId { get; set; }

        [JsonProperty("configDetails")]
        public StaveCurveConfigDetail[]? ConfigDetails { get; set; }

    }

    public class StaveCurveConfigDetail : IConfigDetails
    {
        [JsonProperty("id")]
        public string? Id { get; set; }

        [JsonProperty("paperType")]
        public string? PaperType { get; set; }

        [JsonProperty("rotatePaper")]
        public bool RotatePaper { get; set; }

        [JsonProperty("posX")]
        public double PosX { get; set; }

        [JsonProperty("posY")]
        public double PosY { get; set; }

        [JsonProperty("innerTopX")]
        public double InnerTopX { get; set; }

        [JsonProperty("innerTopY")]
        public double InnerTopY { get; set; }

        [JsonProperty("outerTopX")]
        public double OuterTopX { get; set; }

        [JsonProperty("outerTopY")]
        public double OuterTopY { get; set; }

        [JsonProperty("innerBottomX")]
        public double InnerBottomX { get; set; }

        [JsonProperty("innerBottomY")]
        public double InnerBottomY { get; set; }

        [JsonProperty("outerBottomX")]
        public double OuterBottomX { get; set; }

        [JsonProperty("outerBottomY")]
        public double OuterBottomY { get; set; }

        [JsonProperty("rectX")]
        public double RectX { get; set; }

        [JsonProperty("rectY")]
        public double RectY { get; set; }

        [JsonProperty("rectWidth")]
        public double RectWidth { get; set; }

        [JsonProperty("rectHeight")]
        public double RectHeight { get; set; }

        [JsonProperty("staveCurveConfigId")]
        public string? StaveCurveConfigId { get; set; }


        //             var (posX, posY, innerTopY, outerTopY, innerBottomY, outerBottomY, rectX, rectY, rectWidth, rectHeight) = config;

        public void Deconstruct(out double posX,
                                out double posY,
                                out double innerTopY,
                                out double outerTopY,
                                out double innerBottomY,
                                out double outerBottomY,
                                out double rectX,
                                out double rectY,
                                out double rectWidth,
                                out double rectHeight)
        {
            posX = PosX;
            posY = PosY;
            innerTopY = InnerTopY;
            outerTopY = OuterTopY;
            innerBottomY = InnerBottomY;
            outerBottomY = OuterBottomY;
            rectX = RectX;
            rectY = RectY;
            rectWidth = RectWidth;
            rectHeight = RectHeight;
        }
    }

    public class StaveEndConfig : IStaveConfig
    {
        [JsonProperty("id")]
        public string? Id { get; set; }

        [JsonProperty("defaultPaperType")]
        public string? DefaultPaperType { get; set; }

        [JsonProperty("barrelId")]
        public string? BarrelId { get; set; }

        [JsonProperty("configDetails")]
        public StaveEndConfigDetail[]? ConfigDetails { get; set; }
    }

    public class StaveEndConfigDetail : IConfigDetails
    {
        [JsonProperty("id")]
        public string? Id { get; set; }

        [JsonProperty("paperType")]
        public string? PaperType { get; set; }

        [JsonProperty("rotatePaper")]
        public bool RotatePaper { get; set; }

        [JsonProperty("topEndY")]
        public double TopEndY { get; set; }

        [JsonProperty("bottomEndY")]
        public double BottomEndY { get; set; }

        [JsonProperty("staveEndConfigId")]
        public string? StaveEndConfigId { get; set; }
    }

    public class StaveFrontConfig : IStaveConfig
    {
        [JsonProperty("id")]
        public string? Id { get; set; }

        [JsonProperty("defaultPaperType")]
        public string? DefaultPaperType { get; set; }

        [JsonProperty("barrelId")]
        public string? BarrelId { get; set; }

        [JsonProperty("configDetails")]
        public StaveFrontConfigDetail[]? ConfigDetails { get; set; }
    }

    public class StaveFrontConfigDetail : IConfigDetails
    {
        [JsonProperty("id")]
        public string? Id { get; set; }

        [JsonProperty("paperType")]
        public string? PaperType { get; set; }

        [JsonProperty("rotatePaper")]
        public bool RotatePaper { get; set; }

        [JsonProperty("posX")]
        public double PosX { get; set; }

        [JsonProperty("posY")]
        public double PosY { get; set; }

        [JsonProperty("spacing")]
        public double Spacing { get; set; }

        [JsonProperty("staveFrontConfigId")]
        public string? StaveFrontConfigId { get; set; }
    }

}