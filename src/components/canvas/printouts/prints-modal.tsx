
/*
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useState, useRef, useEffect } from "react";
import PlaningTool from "./editor/PlaningTool";
import StaveEnds from "./editor/StaveEnds";
import StaveTemplate from "./editor/StaveTemplate";
import BarrelSide from "./editor/BarrelSide";
import Ruler from "./editor/Ruler";
import ArrowSmallLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import ArrowSmallRightIcon from "@heroicons/react/24/outline/ArrowRightIcon";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import React from 'react';

function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    //delete link;
}


function PrintModal({ printPageOpen, setPrintPageOpen, barrelConfig }) {
    const printRef = useRef(null);
    const a4 = { width: 210, height: 297 }
    const printMargins = 15;
    const [currentTemplatePage, setCurrentTemplatePage] = useState(0);
    const [staveTemplateRotation, setStaveTemplateRotation] = useState(false);
    const [printScale, setPrintScale] = useState(1.8);


    function handleOnMouseDown(printRef) {
        var dataURL = printRef.current.toDataURL({ pixelRatio: 4 });
        downloadURI(dataURL, 'stage.png');
    }

    const pageLeft = () => {
        if (currentTemplatePage > 0)
            setCurrentTemplatePage(currentTemplatePage - 1)
    }

    const pageRight = () => {
        if (currentTemplatePage < 2)
            setCurrentTemplatePage(currentTemplatePage + 1)
    }

    const scaleUp = () => {
        setPrintScale(function (current) { return current + 0.2; });
    }

    const scaleDown = () => {
        setPrintScale(current => { return current - 0.2; });
    }

    const handleKeyDown = (event) => {
        if (event.key == "Escape") {
            setPrintPageOpen(false)
        }
        if (event.key == "ArrowLeft") {
            pageLeft();
        }
        if (event.key == "ArrowRight") {
            pageRight();
        }
        if (event.key == "ArrowUp") {
            scaleUp();
        }
        if (event.key == "ArrowDown") {
            scaleDown();
        }
    }

    useEffect(function setupListener() {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown])

    const { height, topDiameter, bottomDiameter, staveLength, angle } = barrelConfig;

    let staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
        "  Stave length: " + staveLength + "  Angle: " + angle;
    //let staveTemplateInfoText = "Hej";
    let maxArea = { width: a4.width - printMargins, height: a4.height - printMargins };

  



    return <div>
        <div onClick={() => setPrintPageOpen(false)} className={printPageOpen ? `absolute w-full h-full bg-white top-0 opacity-75` : 'hidden'}></div>

        <div className={printPageOpen ? 'relative mt-20' : 'hidden'}>
            <div className="w-fit m-auto relative ">
                <button onClick={() => setPrintPageOpen(false)} style={{ left: "-3.5em" }} className={`absolute top-0 left-3 bg-white-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded`}>
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
                <button onClick={pageLeft} style={{ top: "45%", left: "-3.5em" }} className={(currentTemplatePage === 0 ? `opacity-0 cursor-default ` : ``) + `absolute left-4 bg-white-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded`}>
                    <ArrowSmallLeftIcon className="f-left h-6 w-6 text-gray-500" />
                </button>
                <div className="inline-block border-2 border-black">
                    <PrintDisplay cross={false} page={currentTemplatePage} visible={true} margins={printMargins} ref={printRef} scale={printScale} a4={a4} barrelConfig={barrelConfig} />
                </div>
                <button onClick={pageRight} style={{ top: "45%" }} className={(currentTemplatePage === 2 ? `opacity-0 cursor-default ` : ``) + `absolute bg-white-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded`}>
                    <ArrowSmallRightIcon className="f-left h-6 w-6 text-gray-500" />
                </button>
                <button onClick={() => handleOnMouseDown(printRef)} className="block m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" id="save">Save as image</button>
            </div>
        </div>
    </div>;
}

export default PrintModal;
*/