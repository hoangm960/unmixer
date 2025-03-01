function hsvaToCMY(h, s, v, a) {
    let c = v * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = v - c;
    let [r, g, b] =
        h < 60
            ? [c, x, 0]
            : h < 120
              ? [x, c, 0]
              : h < 180
                ? [0, c, x]
                : h < 240
                  ? [0, x, c]
                  : h < 300
                    ? [x, 0, c]
                    : [c, 0, x];
    r = (r + m) * a + (1 - a);
    g = (g + m) * a + (1 - a);
    b = (b + m) * a + (1 - a);
    return [1 - r, 1 - g, 1 - b];
}

function mixColors(weights, colorPalette) {
    return colorPalette.reduce(
        (acc, color, i) => {
            return acc.map((val, j) => val + weights[i] * color[j]);
        },
        [0, 0, 0]
    );
}

function lossFunction(weights, targetCMY, colorPalette) {
    let mixedCMY = mixColors(weights, colorPalette);
    return Math.sqrt(
        mixedCMY.reduce((sum, val, i) => sum + (val - targetCMY[i]) ** 2, 0)
    );
}

export function findBestMix(targetHSVA, inputColors) {
    let targetCMY = hsvaToCMY(...targetHSVA);
    let colorPalette = inputColors.map((hsva) => hsvaToCMY(...hsva));
    let n = inputColors.length;
    let weights = new Array(n).fill(1 / n);
    let step = 0.01;
    let bestWeights = weights;
    let minLoss = lossFunction(weights, targetCMY, colorPalette);

    for (let i = 0; i < 1000; i++) {
        let newWeights = bestWeights.map((w) =>
            Math.max(0, Math.min(1, w + (Math.random() - 0.5) * step))
        );
        let sum = newWeights.reduce((a, b) => a + b, 0);
        newWeights = newWeights.map((w) => w / sum);

        let loss = lossFunction(newWeights, targetCMY, colorPalette);
        if (loss < minLoss) {
            minLoss = loss;
            bestWeights = newWeights;
        }
    }

    return Object.fromEntries(
        inputColors.map((color, i) => [color, bestWeights[i]])
    );
}
