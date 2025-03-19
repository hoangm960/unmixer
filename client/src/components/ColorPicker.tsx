import { useState } from "react";
import ColorFul from "@uiw/react-color-colorful";
import { hexToHsva, hsvaToHex } from "@uiw/color-convert";

interface Props {
    initialColor?: string;
    index: number;
    onChangeColor: (color: string, index: number) => void;
}

function ColorPicker({
    initialColor = "#83c5e6",
    index,
    onChangeColor
}: Props) {
    const [hsva, setHsva] = useState(hexToHsva(initialColor));
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
                        onChangeColor(hsvaToHex(hsva), index);
                    }}
                    disableAlpha={true}
                />
            ) : null}
        </div>
    );
}

export default ColorPicker;
