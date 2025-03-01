import { useState } from "react";
import ColorFul from "@uiw/react-color-colorful";
import { hsvaToHex } from "@uiw/color-convert";

function ColorPicker() {
    const [hsva, setHsva] = useState({ h: 200, s: 43, v: 90, a: 1 });

    return (
        <div className="w-1/2 h-1/2 flex flex-col items-center justify-center gap-8">
            <ColorFul
                color={hsva}
                onChange={(color) => {
                    setHsva(color.hsva);
                }}
                disableAlpha={true}
            />
            <div
                className="w-1/3 h-1/3 rounded-2xl flex justify-center items-center text-2xl"
                style={{ backgroundColor: hsvaToHex(hsva) }}
            >
                <p style={{ color: hsva.v <= 50 ? "white" : "black" }}>
                    {hsvaToHex(hsva)}
                </p>
            </div>
        </div>
    );
}

export default ColorPicker;
