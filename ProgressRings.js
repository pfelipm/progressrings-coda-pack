/**
 * A little SVG progress ring generator Pack for Coda
 * @pfelipm, August 2022 / GNU GPL v3
 */

import * as coda from "@codahq/packs-sdk";

export const pack = coda.newPack();

// Color names supported in svg elements as autocomplete values for fillColor and empyColor params
const SVG_COLOR_NAMES = [
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue",
  "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson",
  "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen",
  "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet",
  "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro",
  "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred",
  "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan",
  "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey",
  "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid",
  "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
  "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen",
  "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red",
  "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
  "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato",
  "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
];

// Coda only seems to support as much as 100 values in its autocomplete feature
const SVG_COLOR_NAMES_100 = [
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "bisque", "black", "blanchedalmond", "blue", "brown", "burlywood",
  "cadetblue", "coral", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkolivegreen",
  "darkorange", "darkred", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "deeppink", "deepskyblue", "dimgray", "dodgerblue",
  "firebrick", "fuchsia", "gold", "goldenrod", "gray", "green", "greenyellow", "hotpink", "indianred", "indigo",
  "khaki", "lavender", "lavenderblush", "lightblue", "lightcoral", "lightcyan", "lightgray", "lightgreen", "lightseagreen", "lightskyblue",
  "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "mediumblue", "mediumpurple", "mediumseagreen",
  "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "moccasin", "olive", "olivedrab", "orange", "orangered",
  "palegoldenrod", "palegreen", "palevioletred", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue",
  "salmon", "sandybrown", "seagreen", "sienna", "silver", "skyblue", "slateblue", "slategray", "springgreen", "steelblue",
  "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
];

// Some padding around the progress rings, probably unnecessary
const SAFE_PADDING_FACTOR = 0.05;

/**
 * Main formula
 */
pack.addFormula({

  name: "ProgressRing",
  description: "Generates an SVG progress ring",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "value",
      description: "Current value"
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "max",
      description: "Max value, defaults to 1",
      optional: true
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "fillColorLight",
      description: "Color of filled ring in light mode, use a svg named color or #RRGGBB, defaults to purple",
      optional: true,
      autocomplete: SVG_COLOR_NAMES_100
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "emptyColorLight",
      description: "Color of empty ring in light mode, use a svg named color or #RRGGBB, defaults to lightgray",
      optional: true,
      autocomplete: SVG_COLOR_NAMES_100
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "fillColorDark",
      description: "Color of filled ring in dark mode, use a svg named color or #RRGGBB, defaults to purple",
      optional: true,
      autocomplete: SVG_COLOR_NAMES_100
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "emptyColorDark",
      description: "Color of empty ring in dark mode, use a svg named color or #RRGGBB, defaults to dimgray",
      optional: true,
      autocomplete: SVG_COLOR_NAMES_100
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "radius",
      description: "Radius of ring (pixels), defaults to 100",
      optional: true
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "thickness",
      description: "Thickness of ring (pixels), defaults to 75",
      optional: true
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "drawPie",
      description: "If true, draw a segmented pie chart, defaults to false",
      optional: true
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "steps",
      description: "Number of progress steps, defaults to 16",
      optional: true
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "stepRounding",
      description: "Progress step adjustment, defaults to near",
      autocomplete: ["down", "near", "up"],
      optional: true
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "avoidFalseComplete",
      description: "Always avoid full ring if progress not exactly 100%, defaults to true",
      optional: true
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "avoidFalseEmpty",
      description: "Always avoid empty ring if progress greater than 0%, defaults to false",
      optional: true
    }),
  ],

  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageReference,

  examples: [
    { params: [0.7], result: "// 70% progress ring with default settings //" },
    { params: [15, 20, "#000080", "#C0C0C0"], result: "// 75% blue over light grey progress ring //" },
    { params: [0.9, "midnightblue"], result: "// 90% midnightblue over default color progress ring //" },
    { params: [0.6, "radius: 50", "thickness: 25"], result: "// 60% progress ring with some optional settings" }
  ],

  // Here comes the important part, notice the default values for the optional parameters
  execute: async function ([value,
    max = 1,
    fillColorLight = "purple",
    emptyColorLight = "lightgray",
    fillColorDark = "purple",
    emptyColorDark = "dimgray",
    radius = 100,
    thickness = 75,
    drawPie = false,
    steps = 16,
    stepRounding = "near",
    avoidFalseComplete = true,
    avoidFalseEmpty = false],
    context) {

    // Parameter adjustments
    radius = Math.round(Math.abs(radius));
    thickness = Math.round(Math.abs(thickness));
    steps = Math.round(Math.abs(steps));
    stepRounding = stepRounding.toLowerCase();

    // Some previous checks
    if (value < 0 || max < 0) throw new coda.UserVisibleError("Use non-negative numbers for value and max params!");
    if (value > max) value = max;
    if (thickness > 2 * radius) thickness = 2 * radius;
    if (!["down", "up", "near"].includes(stepRounding)) throw new coda.UserVisibleError("Unknown stepRounding, choose one of the suggested values!")

    // Shall we draw a pie chart instead of a ring?
    if (drawPie) thickness = 2 * radius;

    // Safety padding around progress ring used to avoid casual cropping
    const padding = Math.ceil(SAFE_PADDING_FACTOR * (radius + thickness / 2));

    // Width = Height of svg
    const size = 2 * radius + thickness + 2 * padding;

    // Center point of svg paths
    const center = { x: size / 2, y: size / 2 };

    // Starting point of arc at 12 o'clock
    const start = { x: center.x, y: padding + (thickness == 1 ? 0 : thickness / 2) };

    // Calculates coordinates of breakpoint (filled / empy arcs)
    let ratio;
    switch (stepRounding) {
      case "down": ratio = Math.floor(steps * value / max) / steps; break;
      case "up": ratio = Math.ceil(steps * value / max) / steps; break;
      case "near": ratio = Math.round(steps * value / max) / steps;
    }

    // Exception! >> prevent misleading full / empty rings
    if (avoidFalseComplete && ratio == 1 && value != max) ratio = Math.floor(steps * value / max) / steps;
    if (avoidFalseEmpty && ratio == 0 && value > 0) ratio = Math.ceil(steps * value / max) / steps;

    const angle = (Math.PI / 2 - 2 * Math.PI * ratio);
    const breakpoint = { x: Math.round(center.x + radius * Math.cos(angle)), y: Math.round(center.y - radius * Math.sin(angle)) };

    // console.info(value, radius, size, center, start, breakpoint);

    // Draws a svg progress ring
    let darkModeId = coda.SvgConstants.DarkModeFragmentId;
    let svg = `
      <svg xmlns="http://www.w3.org/2000/svg" height="${size}" width="${size}">
        <g id="${darkModeId}">
          __RING__ 
        </g>
        <style>
          :root {
            --fillColor: ${fillColorLight};
            --emptyColor: ${emptyColorLight};
          }
          svg { stroke-width: ${thickness}; fill: __FILL_COLOR__; }
          .filled { stroke: var(--fillColor); }
          .empty { stroke: var(--emptyColor); }
          #${darkModeId}:target {
            --fillColor: ${fillColorDark};
            --emptyColor: ${emptyColorDark};
          }
        </style>
      </svg>
    `.trim();

    // Hack to avoid center point of different color when drawing 0% or 100% pies
    if (!drawPie || (ratio > 0 && ratio < 1)) svg = svg.replace("__FILL_COLOR__", "none")
    else {
      if (ratio == 1) svg = svg.replace("__FILL_COLOR__", "var(--fillColor)");
      else if (ratio == 0) svg = svg.replace("__FILL_COLOR__", "var(--emptyColor)");
    }


    // Hack to draw 100% ring, svg arc entities are not good at it,and using a couple of arcs of the same color is very slightly wrong
    if (ratio == 1) svg = svg.replace("__RING__", `<circle class ="filled" cx="${center.x}" cy="${center.y}" r="${radius}" />`);

    // ...and another hack to draw a 0% progress ring
    else if (ratio == 0) svg = svg.replace("__RING__", `<circle class ="empty" cx="${center.x}" cy="${center.y}" r="${radius}" />)`);

    // Any other situation demands 1) a filled arc, 2) an empty arc
    else svg = svg.replace("__RING__", `
      <path class="filled"
        d="M ${start.x} ${start.y} A ${radius} ${radius} 0 ${ratio < 0.5 ? 0 : 1} 1 ${breakpoint.x} ${breakpoint.y}" />
      <path class="empty"
      d="M ${breakpoint.x} ${breakpoint.y} A ${radius} ${radius} 0 ${ratio >= 0.5 ? 0 : 1} 1 ${start.x} ${start.y}" />
    `.trim());

    const encoded = Buffer.from(svg).toString("base64");
    //return coda.SvgConstants.DataUrlPrefix + encoded;
    return coda.SvgConstants.DataUrlPrefixWithDarkModeSupport + encoded;

  }

});

/**
 * Column format for default progress rings in light mode
 */
pack.addColumnFormat({
  name: "Progress rings",
  instructions: "Displays the [0..1] values inside a column as default progress rings",
  formulaName: "ProgressRing",
});
