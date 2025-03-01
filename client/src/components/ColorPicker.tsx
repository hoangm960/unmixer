import { useState } from "react";
import ColorFul from "@uiw/react-color-colorful";
import { hsvaToHex } from "@uiw/color-convert";

function ColorPicker() {
    const [hsva, setHsva] = useState({ h: 200, s: 43, v: 90, a: 1 });
    const [isShowPicker, setIsShowPicker] = useState(false);

    return (
        <div className="p-2.5 w-fit h-fit flex flex-col items-center gap-5">
            <div
                className="w-full h-full p-3 rounded-2xl flex justify-center items-center text-2xl cursor-pointer"
                style={{ backgroundColor: hsvaToHex(hsva) }}
                onClick={() => setIsShowPicker(!isShowPicker)}
            >
                <p style={{ color: hsva.v <= 50 ? "white" : "black" }}>
                    {hsvaToHex(hsva)}
                </p>
            </div>
            {isShowPicker ? (
                <ColorFul
                    color={hsva}
                    onChange={(color) => {
                        setHsva(color.hsva);
                    }}
                    disableAlpha={true}
                />
            ) : null}
        </div>
    );
}

export default ColorPicker;
