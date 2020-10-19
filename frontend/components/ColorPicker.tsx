import React from "react";
import { CustomPicker, InjectedColorProps } from "react-color";
import { Hue, Saturation } from "react-color/lib/components/common";

const ColorPicker: React.FC<InjectedColorProps> = (props) => {
  const styles = {
    picker: {
      width: 200,
      padding: "10px 10px 0",
      boxSizing: "initial",
      background: "#fff",
      borderRadius: "4px",
      boxShadow: "0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)",
    },
    saturation: {
      width: "100%",
      paddingBottom: "75%",
      position: "relative",
      overflow: "hidden",
    },
    Saturation: {
      radius: "3px",
      shadow: "inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)",
    },
    controls: {
      display: "flex",
    },
    sliders: {
      padding: "4px 0",
      flex: "1",
    },
    hue: {
      position: "relative",
      height: "10px",
      overflow: "hidden",
    },
    Hue: {
      radius: "2px",
      shadow: "inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)",
    },
  };

  return (
    <>
      <div style={styles.picker} className="sketch-picker">
        <div style={styles.saturation}>
          <Saturation
            {...props}
            style={styles.Saturation}
            onChange={props.onChange}
          />
        </div>
        <div style={styles.controls} className="flexbox-fix">
          <div style={styles.sliders}>
            <div style={styles.hue}>
              <Hue {...props} style={styles.Hue} onChange={props.onChange} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/*
      <div style={styles.picker} className="sketch-picker">
        <div style={styles.saturation}>
          <Saturation
            style={styles.Saturation}
            hsl={hsl}
            hsv={hsv}
            onChange={props.onChange}
          />
        </div>
        <div style={styles.controls} className="flexbox-fix">
          <div style={styles.sliders}>
            <div style={styles.hue}>
              <Hue style={styles.Hue} hsl={hsl} onChange={props.onChange} />
            </div>
          </div>
        </div>
      </div>







      <div
        style={{
          width: "200px",
        }}
      >
        <div style={{ height: "180px" }}>
          <Saturation
            {...props}
            onChange={(color) => {
              console.log(color);
            }}
          />
        </div>

        <div style={{ height: "20px" }}>
          <Hue
            {...props}
            onChange={(color) => {
              console.log(color);
            }}
            color={props.hsl}
          />
        </div>
      </div>
*/

export default CustomPicker(ColorPicker);
