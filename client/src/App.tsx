import { useEffect, useState } from "react";
import ColorPickerList from "@components/ColorPickerList";

function App() {
    const [inputs, setInputs] = useState<string[]>([]);
    const [target, setTarget] = useState<string>("");

    useEffect(() => {
        console.log(inputs, target);
    }, [inputs, target]);

    return (
        <div className="w-dvw h-dvh flex flex-col justify-center items-center gap-5">
            <ColorPickerList
                label="Input Colors"
                onColorsChange={(colors) => setInputs(colors)}
            />
            <ColorPickerList
                label="Target"
                maxNumColors={1}
                onColorsChange={(colors) => setTarget(colors[0])}
            />
        </div>
    );
}

export default App;
