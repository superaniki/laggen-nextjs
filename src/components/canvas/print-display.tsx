
/*


function PrintDisplay = (({ cross, page, visible, a4, barrelConfig, scale, margins }, printRef) => {
  return <Stage visible={visible} ref={printRef} width={a4.width * scale} height={a4.height * scale}>
      <Layer>
          <Rect fill={"white"} x={-5000} y={-5000} width={10000} height={10000} />

          <PlaningTool cross={cross} visible={page == 0 ? true : false} scale={scale} x={30 * scale} y={270 * scale} {...barrelConfig} />
          <StaveTemplate onClick={() => setStaveTemplateRotation(!staveTemplateRotation)} maxArea={maxArea} rotate={staveTemplateRotation} cross={cross} visible={page == 1 ? true : false} x={a4.width * scale * 0.5} y={margins * scale} {...barrelConfig} scale={scale} />
          <StaveEnds cross={cross} visible={page == 2 ? true : false} scale={scale} x={a4.width * scale * 0.5} y={a4.height} {...barrelConfig} />

          <BarrelSide visible={true} inColor={false} x={a4.width * scale - margins * scale} y={a4.height * scale - margins * scale}
              {...barrelConfig} thickStroke={true} scale={0.07 * scale} />
          <Ruler scale={scale * 10} y={a4.height * scale - margins * scale} x={margins * scale - 15} xLength={6} yLength={0} />
          <Text x={margins * scale} rotation={270} y={a4.height * scale - 25 * scale} text={staveTemplateInfoText} fontFamily="courier" fontSize={3 * scale} fill={"black"} />
      </Layer>
  </Stage>
});
*/