from flask import Flask, jsonify, request
from flask_cors import CORS

import numpy as np
from scipy.optimize import minimize

app = Flask(__name__)
cors = CORS(app, origins="*")


# --- Color Conversion Functions ---


def hex_to_rgb(hex_color):
    """Convert a hex color (e.g. '#FF00FF') to an RGB numpy array in range [0,1]."""
    hex_color = hex_color.lstrip("#")
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))
    return np.array([r, g, b]) / 255.0


def rgb_to_lab(rgb):
    """
    Convert an sRGB color to Lab.
    This function applies inverse gamma correction, converts to XYZ,
    and then to Lab using the D65 illuminant.
    """

    # Convert sRGB to linear RGB
    def inv_gamma(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r_lin, g_lin, b_lin = [inv_gamma(c) for c in rgb]

    # Convert to XYZ using the sRGB matrix (D65 illuminant)
    X = (0.4124 * r_lin + 0.3576 * g_lin + 0.1805 * b_lin) * 100
    Y = (0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin) * 100
    Z = (0.0193 * r_lin + 0.1192 * g_lin + 0.9505 * b_lin) * 100

    # Normalize by D65 white point
    Xn, Yn, Zn = 95.047, 100.0, 108.883
    x = X / Xn
    y = Y / Yn
    z = Z / Zn

    # Helper function for Lab conversion
    def f(t):
        return t ** (1 / 3) if t > 0.008856 else (7.787 * t) + (16 / 116)

    fx, fy, fz = f(x), f(y), f(z)
    L = (116 * fy) - 16
    a = 500 * (fx - fy)
    b = 200 * (fy - fz)
    return np.array([L, a, b])


def delta_e(lab1, lab2):
    """Compute the CIE76 delta E (Euclidean distance) between two Lab colors."""
    return np.linalg.norm(lab1 - lab2)


# --- Watercolor Mixing Functions ---


def hex_to_cmy(hex_color):
    """
    Convert a hex color to CMY.
    For watercolor mixing (a subtractive process), CMY values are given by 1 - RGB.
    """
    rgb = hex_to_rgb(hex_color)
    return 1 - rgb


def mix_colors(weights, color_palette):
    """Mix colors based on given weights using subtractive color mixing (CMY)."""
    return np.dot(weights, color_palette)


def cmy_to_rgb(cmy):
    """Convert CMY color to RGB. Since CMY = 1 - RGB, we have RGB = 1 - CMY."""
    rgb = 1 - cmy
    return np.clip(rgb, 0, 1)


def loss_function(weights, target_lab, color_palette):
    """
    Given a set of weights, compute the mixed color in CMY space,
    convert it to RGB then to Lab, and return the delta E (color difference)
    compared to the target Lab color.
    """
    mixed_cmy = mix_colors(weights, color_palette)
    mixed_rgb = cmy_to_rgb(mixed_cmy)
    mixed_lab = rgb_to_lab(mixed_rgb)
    return delta_e(mixed_lab, target_lab)


def find_best_mix(target_hex, input_colors):
    """Find the optimal mixing ratios of input_colors to match the target_hex."""
    target_rgb = hex_to_rgb(target_hex)
    target_lab = rgb_to_lab(target_rgb)
    color_palette = np.array([hex_to_cmy(c) for c in input_colors])

    n = len(input_colors)
    initial_weights = np.ones(n) / n  # Start with equal proportions
    bounds = [(0, 1)] * n
    constraints = {"type": "eq", "fun": lambda w: np.sum(w) - 1}  # weights sum to 1

    result = minimize(
        loss_function,
        initial_weights,
        args=(target_lab, color_palette),
        bounds=bounds,
        constraints=constraints,
        method="SLSQP",
    )

    if result.success:
        return dict(zip(input_colors, result.x))
    else:
        return None


@app.route("/api/mix", methods=["POST"])
def mix():
    data = request.get_json()
    target_hex = data.get("target_hex")
    input_colors = data.get("input_colors")
    if not target_hex or not input_colors:
        return (
            jsonify({"error": "Please provide target_hex and input_colors in JSON"}),
            400,
        )

    best_mix = find_best_mix(target_hex, input_colors)
    if best_mix is not None:
        return jsonify(best_mix)
    else:
        return jsonify({"error": "No optimal mix found"}), 500


if __name__ == "__main__":
    app.run()
