import ColorPickerList from "@components/ColorPickerList";

function App() {
    return (
        <div className="w-dvw h-dvh flex flex-col justify-center items-center gap-5">
            <ColorPickerList label="Input Colors" />
            <ColorPickerList label="Target" />
        </div>
    );
}

export default App;
