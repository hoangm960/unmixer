import ColorPicker from "@components/ColorPicker";

interface Props {
    label: string;
}

function ColorPickerList({ label }: Props) {
    return (
        <div className="flex justify-center items-center">
            <p className="text-2xl font-bold">{label}:</p>
            <ColorPicker />
            <ColorPicker />
            <ColorPicker />
        </div>
    );
}

export default ColorPickerList;
