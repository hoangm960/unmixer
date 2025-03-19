import { useState } from "react";
import ColorPickerList from "@components/ColorPickerList";
import { API_BASE } from "@constants/api.js";
import { hexToHsva } from "@uiw/color-convert";

function App() {
    const [inputs, setInputs] = useState<string[]>([]);
    const [target, setTarget] = useState<string>("");
    const [result, setResult] = useState<Object>();

    const onSolveClick = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/mix`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    target_hex: target,
                    input_colors: inputs
                })
            });
            if (!res.ok) {
                throw new Error(`Response status: $(response.status)`);
            }
            const data = await res.json();
            setResult(data);
            console.log(data);
        } catch (error) {
            if (typeof error === "string") {
                console.log(error.toUpperCase());
            } else if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    return (
        <div className="w-dvw h-dvh flex flex-col justify-center items-center gap-5">
            <ColorPickerList
                label="Input Colors"
                onColorsChange={(colors) => setInputs(colors)}
            />
            <ColorPickerList
                label="Target"
                onColorsChange={(colors) => setTarget(colors[0])}
                isInput={false}
            />
            <div
                className="text-white font-medium rounded-lg text-2xl cursor-pointer px-5 py-2.5 me-2 mb-2 bg-blue-800 hover:bg-blue-700 focus:ring-blue-700 border-blue-70"
                onClick={onSolveClick}
            >
                Solve
            </div>
            <div className="flex flex-col items-start gap-3">
                {result &&
                    Object.entries(result).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex justify-center items-center gap-5"
                        >
                            <div
                                className="w-fit h-full p-3 rounded-2xl flex justify-center items-center text-2xl"
                                style={{ backgroundColor: key }}
                            >
                                <p
                                    style={{
                                        color:
                                            hexToHsva(key).v <= 50
                                                ? "white"
                                                : "black"
                                    }}
                                >
                                    {key}
                                </p>
                            </div>
                            <div className="text-2xl">
                                {Number((value * 100).toFixed(2))}%
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default App;
