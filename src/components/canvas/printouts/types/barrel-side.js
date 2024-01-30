import Cross from "./Cross";
import useImage from "use-image";
import { Line, Image, Group } from "react-konva";

function BarrelSide({ cross = false, angle, height, visible, inColor = true, bottomDiameter, x, y, staveTopThickness,
    staveBottomThickness, bottomThickness, bottomMargin, scale, thickStroke = false }) {
    const barrelColor = inColor ? "#F4D279" : "white";
    const stroke = thickStroke ? 4 : 1;
    const url = 'apple.png';
    const [image, imageStatus] = useImage(url);

    const tan = parseFloat(Math.tan(angle * Math.PI / 180));
    const length = parseFloat(tan * height); // position till motsatt sida av vinkeln
    const hypotenusaLength = Math.sqrt((height * height) + (length * length));
    const outlinePoints = [0, 0, -length, -height, bottomDiameter + length, -height, bottomDiameter, 0];
    const leftStavePoints = [0, 0, 0, -hypotenusaLength, staveTopThickness, -hypotenusaLength, staveBottomThickness, 0];
    const rightStavePoints = [0, 0, 0, -hypotenusaLength, -staveTopThickness, -hypotenusaLength, -staveBottomThickness, 0];
    const angleLength = parseFloat(tan * bottomMargin) - (staveBottomThickness - 5); // angle-dependent extra length to plate
    const bottomPlantePoints = [0 + angleLength, 0, 0 + angleLength, -bottomThickness, -bottomDiameter - angleLength, -bottomThickness, -bottomDiameter - angleLength, 0]

    function Outline({ points }) {
        return <Line fill={barrelColor} closed opacity={.5} points={points} strokeWidth={stroke} stroke={"black"} />
    }

    function LeftStave({ points }) {
        return <Line rotation={-angle} fill={barrelColor} points={points} strokeWidth={stroke} stroke={"black"} closed ></Line>
    }

    function RightStave({ points }) {
        return <Line rotation={angle} x={(bottomDiameter)} fill={barrelColor} points={points} strokeWidth={stroke} stroke={"black"} closed ></Line>
    }

    function BottomPlate({ points }) {
        return <Line x={(bottomDiameter)} y={- bottomMargin} fill={barrelColor} points={points} strokeWidth={stroke} stroke={"black"} closed ></Line>
    }

    function Apple({ x, y, visible, sizeMm }) {
        const size = sizeMm;
        return <Image alt="apple" visible={visible} opacity={0.7}
            x={x - size - size}
            y={y - size + 4}
            image={image} width={size} height={size} />
    }

    return <Group x={x} y={y} scale={{ x: scale, y: scale }}>
        <Group x={(-bottomDiameter - length)} y={0}>
            <Outline points={outlinePoints} />
            <LeftStave points={leftStavePoints} />
            <RightStave points={rightStavePoints} />
            <BottomPlate points={bottomPlantePoints} />
        </Group>
        <Apple visible={imageStatus === 'loaded' ? true : false} x={-bottomDiameter - length} y={0} sizeMm={80} />
        <Cross visible={cross} color="green" />
    </Group>;
}

export default BarrelSide;

/*
 x={(-diameter * 0.05)} y={height * 0.5 + y}
*/