import { useEffect, useState } from "react";
import ColorPicker from "@components/ColorPicker";

interface Props {
    label: string;
    maxNumColors?: number;
    onColorsChange: (colors: string[]) => void;
}

function ColorPickerList({ label, maxNumColors = 5, onColorsChange }: Props) {
    const [colors, setColors] = useState<string[]>([]);

    useEffect(() => {
        onColorsChange(colors);
    }, [colors]);

    const onChangeColor = (color: string, index: number) => {
        setColors(colors.map((old, idx) => (idx == index ? color : old)));
    };

    return (
        <div className="flex justify-center items-center">
            <p className="text-2xl font-bold">{label}:</p>
            {colors.map((_, index: number) => (
                <ColorPicker
                    key={index}
                    index={index}
                    onChangeColor={onChangeColor}
                />
            ))}
            {colors.length !== maxNumColors && (
                <div
                    className="text-white font-medium rounded-lg text-2xl cursor-pointer px-5 py-2.5 me-2 mb-2 bg-gray-800 hover:bg-gray-700 focus:ring-gray-700 border-gray-70"
                    onClick={() => setColors([...colors, "#83c5e6"])}
                >
                    +
                </div>
            )}
        </div>
    );
}

export default ColorPickerList;
