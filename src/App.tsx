import { useEffect } from "react";
import ColorPicker from "@components/ColorPicker";
import { findBestMix } from "./unmixer.js";

function App() {
    useEffect(() => {
        let targetHSVA = [270, 0.8, 0.7, 1]; // Example: Blue-Violet in HSVA
        let inputColors = [
            [0, 1, 1, 1], // Red
            [120, 1, 1, 1], // Green
            [240, 1, 1, 1], // Blue
            [60, 1, 1, 1] // Yellow
        ];
        console.log(findBestMix(targetHSVA, inputColors));
    }, []);
    return (
        <div className="w-dvw h-dvh flex justify-center items-center">
            <ColorPicker />
        </div>
    );
}

export default App;
