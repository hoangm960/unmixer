import { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";

function ColorPicker() {
    const [hsva, setHsva] = useState({ h: 200, s: 43, v: 90, a: 1 });

    return (
        <div className="w-1/2 h-1/2 flex flex-col items-center justify-center gap-2">
            <div
                className="w-1/2 h-1/2 rounded-2xl flex justify-center items-center text-2xl"
                style={{ backgroundColor: hsvaToHex(hsva) }}
            >
                {hsvaToHex(hsva)}
            </div>
            <Wheel
                color={hsva}
                onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
            />
        </div>
    );
}

export default ColorPicker;
