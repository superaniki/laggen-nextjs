import useImage from "use-image";
import { Line, Image, Group } from "react-konva";
import { BarrelDetails } from "@prisma/client";

type BarrelSideProps = {
    inColor: boolean,
    x: number,
    y: number,
    barrelDetails: BarrelDetails,
    thickStroke: boolean,
    scale: number
}

function BarrelSide({ inColor = true, barrelDetails, x, y, scale, thickStroke = false }: BarrelSideProps) {
    const { angle, height, bottomDiameter, staveTopThickness, staveBottomThickness, bottomThickness, bottomMargin } = { ...barrelDetails };

    const barrelColor = inColor ? "#F4D279" : "white";
    const stroke = thickStroke ? 4 : 1;
    const url = '/apple.png';
    const [image, imageStatus] = useImage(url);

    const tan = Math.tan(angle * Math.PI / 180);
    const length = tan * height; // position till motsatt sida av vinkeln
    const hypotenusaLength = Math.sqrt((height * height) + (length * length));
    const outlinePoints = [0, 0, -length, -height, bottomDiameter + length, -height, bottomDiameter, 0];
    const leftStavePoints = [0, 0, 0, -hypotenusaLength, staveTopThickness, -hypotenusaLength, staveBottomThickness, 0];
    const rightStavePoints = [0, 0, 0, -hypotenusaLength, -staveTopThickness, -hypotenusaLength, -staveBottomThickness, 0];
    const angleLength = (tan * bottomMargin) - (staveBottomThickness - 5); // angle-dependent extra length to plate
    const bottomPlantePoints = [0 + angleLength, 0, 0 + angleLength, -bottomThickness, -bottomDiameter - angleLength, -bottomThickness, -bottomDiameter - angleLength, 0]

    function Outline({ points }: { points: number[] }) {
        return <Line fill={barrelColor} closed opacity={.5} points={points} strokeWidth={stroke} stroke={"black"} />
    }

    function LeftStave({ points }: { points: number[] }) {
        return <Line rotation={-angle} fill={barrelColor} points={points} strokeWidth={stroke} stroke={"black"} closed ></Line>
    }

    function RightStave({ points }: { points: number[] }) {
        return <Line rotation={angle} x={(bottomDiameter)} fill={barrelColor} points={points} strokeWidth={stroke} stroke={"black"} closed ></Line>
    }

    function BottomPlate({ points }: { points: number[] }) {
        return <Line x={(bottomDiameter)} y={- bottomMargin} fill={barrelColor} points={points} strokeWidth={stroke} stroke={"black"} closed ></Line >
    }

    function Apple({ x, y, visible, sizeMm }: { x: number, y: number, visible: boolean, sizeMm: number }) {
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
    </Group>;
}

export default BarrelSide;