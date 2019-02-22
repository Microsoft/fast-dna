/*---------
  IMPORTS
----------*/

import * as React from "react";
import manageJss, { ComponentStyles } from "@microsoft/fast-jss-manager-react";
import PaletteEditorPane from "./PaletteEditorPane/PaletteEditorPane";
import { IPaletteEditorPaneParamsChangedArgs } from "./PaletteEditorPane/PaletteEditorPane";
import PaletteDisplay from "./PaletteDisplay/PaletteDisplay";
import { ColorInterpolationSpace, ColorRGBA64, parseColor } from "../../src/colorlib";

/*------------
  JSS STYLES
-------------*/

interface IPaletteEditorNameContract {
  outerContainer: string;
  mainPane: string;
  editorPane: string;
  newPalette: string;
}

const styles: ComponentStyles<IPaletteEditorNameContract, any> = {
  outerContainer: {
    display: "grid",
    gridTemplateColumns: "auto 300px"
  },
  mainPane: {
    gridColumn: "1 1",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  editorPane: {
    gridColumn: "2 2"
  },
  newPalette: {
    width: "200px",
    height: "100px",
    margin: "8px 8px 8px 8px",
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "center"
  }
};

/*----------------
  PROPS & STATES
-----------------*/

interface IPaletteEditorProps {
  managedClasses: IPaletteEditorNameContract;
}

interface IPaletteEditorState {
  paletteList: ColorRGBA64[];
  steps?: number;
  interpolationMode?: ColorInterpolationSpace;
  scaleColorLight?: ColorRGBA64;
  scaleColorDark?: ColorRGBA64;
  clipLight?: number;
  clipDark?: number;
  saturationAdjustmentCutoff?: number;
  saturationLight?: number;
  saturationDark?: number;
  overlayLight?: number;
  overlayDark?: number;
  multiplyLight?: number;
  multiplyDark?: number;
}

/*------------------
  CLASS DEFINITION
-------------------*/

class PaletteEditor extends React.Component<
  IPaletteEditorProps,
  IPaletteEditorState
> {
  /*-------------
    CONSTRUCTOR
  --------------*/

  constructor(props: IPaletteEditorProps) {
    super(props);
    this.state = {
      paletteList: [
        parseColor("#e74856")!,
        parseColor("#e74856")!,
        parseColor("#e74856")!
      ]
    };
  }

  private onPaletteParamsChanged(e: IPaletteEditorPaneParamsChangedArgs): void {
    this.setState(e);
  }

  private onPaletteBaseColorChanged(
    sourceId: number,
    newColor: ColorRGBA64
  ): void {
    this.setState(prevState => {
      const newPaletteList: ColorRGBA64[] = new Array(
        prevState.paletteList.length
      );
      prevState.paletteList.map((a: ColorRGBA64, index: number) => {
        if (index == sourceId) {
          newPaletteList[index] = newColor;
        } else {
          newPaletteList[index] = a;
        }
      });
      return { paletteList: newPaletteList };
    });
  }

  private onAddNewPalette(): void {
    this.setState(prevState => {
      const newPaletteList: ColorRGBA64[] = new Array(
        prevState.paletteList.length + 1
      );
      prevState.paletteList.map((a: ColorRGBA64, index: number) => {
        newPaletteList[index] = a;
      });
      newPaletteList[newPaletteList.length - 1] = parseColor("#e74856")!;
      return { paletteList: newPaletteList };
    });
  }

  /*--------------
    REACT RENDER
  ---------------*/

  public render(): JSX.Element {
    const paletteDisplayDivs: JSX.Element[] = this.state.paletteList.map(
      (a: ColorRGBA64, index: number) => {
        return (
          <PaletteDisplay
            key={index}
            id={index}
            onBaseColorChanged={(a, index) =>
              this.onPaletteBaseColorChanged(a, index)
            }
            baseColor={a}
            steps={this.state.steps}
            interpolationMode={this.state.interpolationMode}
            scaleColorLight={this.state.scaleColorLight}
            scaleColorDark={this.state.scaleColorDark}
            clipLight={this.state.clipLight}
            clipDark={this.state.clipDark}
            saturationAdjustmentCutoff={this.state.saturationAdjustmentCutoff}
            saturationLight={this.state.saturationLight}
            saturationDark={this.state.saturationDark}
            overlayLight={this.state.overlayLight}
            overlayDark={this.state.overlayDark}
            multiplyLight={this.state.multiplyLight}
            multiplyDark={this.state.multiplyDark}
          />
        );
      }
    );

    return (
      <div className={this.props.managedClasses.outerContainer}>
        <div className={this.props.managedClasses.mainPane}>
          {paletteDisplayDivs}
          <div className={this.props.managedClasses.newPalette}>
            <button onClick={e => this.onAddNewPalette()}>
              Add new palette
            </button>
          </div>
        </div>
        <div className={this.props.managedClasses.editorPane}>
          <PaletteEditorPane
            onParamsChanged={e => this.onPaletteParamsChanged(e)}
            steps={this.state.steps}
            interpolationMode={this.state.interpolationMode}
            scaleColorLight={this.state.scaleColorLight}
            scaleColorDark={this.state.scaleColorDark}
            clipLight={this.state.clipLight}
            clipDark={this.state.clipDark}
            saturationAdjustmentCutoff={this.state.saturationAdjustmentCutoff}
            saturationLight={this.state.saturationLight}
            saturationDark={this.state.saturationDark}
            overlayLight={this.state.overlayLight}
            overlayDark={this.state.overlayDark}
            multiplyLight={this.state.multiplyLight}
            multiplyDark={this.state.multiplyDark}
          />
        </div>
      </div>
    );
  }
}

export default manageJss(styles)(PaletteEditor);
