// Handle for div that stores the containers of grid rows
const gridContainer = document.querySelector("#grid-container");
// Initialize global parameters to access grid elements for event listeners
let gridDivs;
let mouseIsDown;

// Set grid width & height to be the height of the outer container in pixels
const gridDim = document.querySelector("#content-container").clientHeight;

// Set grid line widths in pixels
const outerGridLinesDim = 3;
const innerGridLinesDim = 0.5;

// Set default hue color values for sketching in HSL
// 0 and 361 are both outside acceptable hue values and represent black and white
let paintColorValue = 0; // black
let bgColorValue = 361; // white

// Set default number of coloring boxes ("pixels") per side
let numSquaresPerSide = 64;

// Adjust grid squares to account for additional border pixels
let adjustedGridDim =
  gridDim -
  2 * outerGridLinesDim -
  2 * innerGridLinesDim * (numSquaresPerSide - 2);

// Create initial grid using default parameters above
createGrid();

// Get the container holding all button and slider options
optionsDiv = document.querySelector("#options-container");

// Create list to contain paint option items (sliders and buttons)
const optionsList = document.createElement("ul");
optionsList.id = "options-list";
optionsDiv.appendChild(optionsList);

// Create and append list elements for paint options
let optionsItems = [];
for (let i = 0; i < 12; i++) {
  optionsItems[i] = document.createElement("li");
  optionsItems[i].classList.add("options-list-item");
  optionsList.appendChild(optionsItems[i]);
}
let optsNum = 0;

// Create and append paint and background color selectors formatted for hsl (0 is black and 361 is white)

// Create container to hold paint color display window and label (flexed)
let paintColorBox = document.createElement("div");
paintColorBox.classList.add("color-box");
optionsItems[optsNum].appendChild(paintColorBox);
optsNum++;

// Create active paint color display window
const colorOptionsDisplay = document.createElement("div");
colorOptionsDisplay.classList.add("color-display");
colorOptionsDisplay.style.backgroundColor = hue2hsl(paintColorValue);
paintColorBox.appendChild(colorOptionsDisplay);

// Create active paint color display window
const colorOptionsDisplayLabel = document.createElement("div");
colorOptionsDisplayLabel.classList.add("color-label");
colorOptionsDisplayLabel.textContent = `Paint Color`;
paintColorBox.appendChild(colorOptionsDisplayLabel);

// Create color slider for paint color
const colorOptions = document.createElement("input");
colorOptions.classList.add("slider-input");
colorOptions.type = "range";
colorOptions.min = 0;
colorOptions.max = 361;
colorOptions.value = paintColorValue;
optionsItems[optsNum].appendChild(colorOptions);
optsNum++;

// Create container to hold background color display window and label (flexed)
bgColorBox = document.createElement("div");
bgColorBox.classList.add("color-box");
optionsItems[optsNum].appendChild(bgColorBox);
optsNum++;

// Create active background color display window
const bgColorOptionsDisplay = document.createElement("div");
bgColorOptionsDisplay.classList.add("color-display");
bgColorOptionsDisplay.style.backgroundColor = hue2hsl(bgColorValue);
bgColorBox.appendChild(bgColorOptionsDisplay);

// Create active background color label
const bgColorOptionsDisplayLabel = document.createElement("div");
bgColorOptionsDisplayLabel.classList.add("color-label");
bgColorOptionsDisplayLabel.textContent = `Bkgrd Color`;
bgColorBox.appendChild(bgColorOptionsDisplayLabel);

// Create color slider for background color
const bgColorOptions = document.createElement("input");
bgColorOptions.classList.add("slider-input");
bgColorOptions.type = "range";
bgColorOptions.min = 0;
bgColorOptions.max = 361;
bgColorOptions.value = bgColorValue;
optionsItems[optsNum].appendChild(bgColorOptions);
optsNum++;

// Create color-grab option button for setting paint color
const grabOption = document.createElement("button");
grabOption.id = "grab-btn";
grabOption.textContent = "Color Grab";
optionsItems[optsNum].appendChild(grabOption);
optsNum++;

// Create rainbow option button for rainbow colors
const rainbowOption = document.createElement("button");
rainbowOption.id = "rainbow-btn";
rainbowOption.textContent = "Rainbow Mode";
optionsItems[optsNum].appendChild(rainbowOption);
optsNum++;

// Create shading options button
const shadingOption = document.createElement("button");
shadingOption.id = "shading-btn";
shadingOption.textContent = "Shading Mode";
optionsItems[optsNum].appendChild(shadingOption);
optsNum++;

// Create lighten options button
const lightenOption = document.createElement("button");
lightenOption.id = "lighten-btn";
lightenOption.textContent = "Lighten Mode";
optionsItems[optsNum].appendChild(lightenOption);
optsNum++;

// Create eraser option button
const erasorOption = document.createElement("button");
erasorOption.id = "erasor-btn";
erasorOption.textContent = "Erasor";
optionsItems[optsNum].appendChild(erasorOption);
optsNum++;

// Create clear option button
const clearOption = document.createElement("button");
clearOption.id = "clear-btn";
clearOption.textContent = "Clear Grid";
optionsItems[optsNum].appendChild(clearOption);
optsNum++;

// Create slider for grid size dimension
const gridSliderLabel = document.createElement("div");
gridSliderLabel.classList.add("grid-label");
gridSliderLabel.textContent = `Grid: ${numSquaresPerSide} x ${numSquaresPerSide}`;
optionsItems[optsNum].appendChild(gridSliderLabel);
optsNum++;

const gridSlider = document.createElement("input");
gridSlider.classList.add("slider-input");
gridSlider.type = "range";
gridSlider.min = 2;
gridSlider.max = 100;
gridSlider.value = numSquaresPerSide;
optionsItems[optsNum].appendChild(gridSlider);
optsNum++;

// Set listeners for mousedown AND mouseover to initiate draw

// Listen for input on Paint Color slider button to change paint color for painting
colorOptions.addEventListener("input", () => {
  lightenOption.classList.remove("active");
  erasorOption.classList.remove("active");
  shadingOption.classList.remove("active");
  rainbowOption.classList.remove("active");
  grabOption.classList.remove("active");
  colorOptionsDisplay.style.backgroundColor = hue2hsl(colorOptions.value);
});
// Listen for input on Bkgrd Color slider button to change background paint color display
bgColorOptions.addEventListener("input", () => {
  bgColorValue = bgColorOptions.value;
  bgColorOptionsDisplay.style.backgroundColor = hue2hsl(bgColorValue);
});
// Listen for change on Bkgrd Color slider button to change background paint color on grid
bgColorOptions.addEventListener("change", () => {
  let gridDivs = document.querySelectorAll("div.grid:not(.painted)");
  gridDivs.forEach(
    (gridDiv) => (gridDiv.style.backgroundColor = hue2hsl(bgColorValue))
  );
});
// Listen for click on Color Grab button to set paint color to whatever color is clicked on the grid via an "active" class toggle (all other buttons are set to inactive)
grabOption.addEventListener("click", () => {
  lightenOption.classList.remove("active");
  erasorOption.classList.remove("active");
  shadingOption.classList.remove("active");
  rainbowOption.classList.remove("active");
  grabOption.classList.toggle("active");
});
// Listen for click on Rainbow Mode button to paint each grid square with a random color via an "active" class toggle (all other buttons are set to inactive)
rainbowOption.addEventListener("click", () => {
  lightenOption.classList.remove("active");
  erasorOption.classList.remove("active");
  shadingOption.classList.remove("active");
  grabOption.classList.remove("active");
  rainbowOption.classList.toggle("active");
});
// Listen for click on Shading Mode button to shade paint (incl background) via an "active" class toggle (all other buttons are set to inactive)
shadingOption.addEventListener("click", () => {
  rainbowOption.classList.remove("active");
  lightenOption.classList.remove("active");
  erasorOption.classList.remove("active");
  grabOption.classList.remove("active");
  shadingOption.classList.toggle("active");
});
// Listen for click on Lighten Mode button to lighten paint (incl background) via an "active" class toggle (all other buttons are set to inactive)
lightenOption.addEventListener("click", () => {
  rainbowOption.classList.remove("active");
  shadingOption.classList.remove("active");
  erasorOption.classList.remove("active");
  grabOption.classList.remove("active");
  lightenOption.classList.toggle("active");
});
// Listen for click on Erasor button to erase paint (incl shading) via an "active" class toggle (all other buttons are set to inactive)
erasorOption.addEventListener("click", () => {
  rainbowOption.classList.remove("active");
  shadingOption.classList.remove("active");
  lightenOption.classList.remove("active");
  grabOption.classList.remove("active");
  erasorOption.classList.toggle("active");
});
// Listen for click on Clear Grid button to remove all paint (incl shading)
clearOption.addEventListener("click", () => {
  let gridDivs = document.querySelectorAll("div.grid");
  gridDivs.forEach((gridDiv) => {
    gridDiv.style.backgroundColor = hue2hsl(bgColorValue);
    gridDiv.classList.remove("painted");
  });
});
// Listen for input on the grid slider and update the text display for grid size
gridSlider.addEventListener("input", () => {
  gridSliderLabel.textContent = `Grid: ${gridSlider.value} x ${gridSlider.value}`;
});
// Listen for change to grid slider and re-create grid with chosen number of squares
gridSlider.addEventListener("change", () => {
  numSquaresPerSide = gridSlider.value;
  adjustedGridDim =
    gridDim -
    2 * outerGridLinesDim -
    2 * innerGridLinesDim * (numSquaresPerSide - 2);
  createGrid();
});

const foot = document.querySelector("footer");
let cpyrt = document.createElement("p");
cpyrt.textContent = `Copyright © ${new Date().getFullYear()} skothar3`;
let gitLink = document.createElement("a");
let gitIcon = document.createElement("i");
gitLink.href = `https://github.com/skothar3`;
gitLink.target = "_blank";
gitIcon.classList.add(`fa-brands`, `fa-square-github`, `fa-lg`);

foot.appendChild(cpyrt);
foot.appendChild(gitLink);
gitLink.appendChild(gitIcon);

function hue2hsl(colorValue) {
  let newColor;
  if (colorValue == 0) {
    newColor = `hsl(0,0%,0%)`;
  } else if (colorValue == 361) {
    newColor = `hsl(0,0%,100%)`;
  } else {
    newColor = `hsl(${colorValue},100%,50%)`;
  }
  return newColor;
}

function draw(e) {
  if (mouseIsDown === true) {
    if (erasorOption.className.includes("active")) {
      e.target.style.backgroundColor = hue2hsl(bgColorValue);
      e.target.classList.remove("painted");
    } else if (grabOption.className.includes("active")) {
      let rgb = e.target.style.backgroundColor;
      let hsl = rgb2hsl(rgb);
      colorOptions.value = hsl[0];
      colorOptionsDisplay.style.backgroundColor = hue2hsl(colorOptions.value);
      grabOption.classList.remove("active");
    } else if (shadingOption.className.includes("active")) {
      let rgb = e.target.style.backgroundColor;
      let hsl = shading(rgb, -10);
      let hslString = hsl.map((num) => num.toString());
      hslString[1] += `%`;
      hslString[2] += `%`;
      e.target.style.backgroundColor = `hsl(${hslString})`;
      e.target.classList.add("painted");
    } else if (lightenOption.className.includes("active")) {
      let rgb = e.target.style.backgroundColor;
      let hsl = shading(rgb, 10);
      let hslString = hsl.map((num) => num.toString());
      hslString[1] += `%`;
      hslString[2] += `%`;
      e.target.style.backgroundColor = `hsl(${hslString})`;
      e.target.classList.add("painted");
    } else if (rainbowOption.className.includes("active")) {
      let randomColorChoice = Math.floor(Math.random() * 360) + 1;
      e.target.style.backgroundColor = `hsl(${randomColorChoice},100%,50%)`;
      e.target.classList.add("painted");
    } else {
      e.target.style.backgroundColor = hue2hsl(colorOptions.value);
      e.target.classList.add("painted");
    }
  }
}
// Function to output correct shading via hsl
function shading(rgb, amount) {
  const hsl = rgb2hsl(rgb);
  let hslNew;
  if (
    (amount < 0 && hsl[2] + amount >= 0) ||
    (amount > 0 && hsl[2] + amount <= 100)
  ) {
    hslNew = [hsl[0], hsl[1], hsl[2] + amount];
  } else {
    hslNew = hsl;
  }
  return hslNew;
}
// Function to convert rgb values to hsl values in order to apply shading to grid
function rgb2hsl(rgb) {
  const rgbArray = rgb
    .slice(rgb.indexOf("(") + 1, rgb.indexOf(")"))
    .split(",")
    .map((num) => parseFloat(num));
  const r = rgbArray[0] / 255;
  const g = rgbArray[1] / 255;
  const b = rgbArray[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const c = max - min;
  let L = (max + min) / 2;
  let S;
  let H;
  if (c == 0) {
    H = 0;
    S = 0;
  } else {
    S = c / (1 - Math.abs(2 * L - 1));
    switch (max) {
      case r:
        var segment = (g - b) / c;
        var shift = 0 / 60; // R° / (360° / hex sides)
        if (segment < 0) {
          // H > 180, full rotation
          shift = 360 / 60; // R° / (360° / hex sides)
        }
        H = segment + shift;
        break;
      case g:
        var segment = (b - r) / c;
        var shift = 120 / 60; // G° / (360° / hex sides)
        H = segment + shift;
        break;
      case b:
        var segment = (r - g) / c;
        var shift = 240 / 60; // B° / (360° / hex sides)
        H = segment + shift;
        break;
    }
  }
  return [H * 60, S * 100, L * 100]; // H is in [0,6], scale it up
}

function createGrid() {
  // Clear existing grid, if any exists
  while (gridContainer.firstChild) {
    gridContainer.firstChild.remove();
  }
  // Initialize array to store div row containers
  let rowContainer = [];

  // Loop over the determined number of squares (numSquaresPerSide**2) and create corresponding divs
  for (let i = 0; i < numSquaresPerSide; i++) {
    rowContainer[i] = document.createElement("div");
    rowContainer[i].classList.add("row-container");
    gridContainer.appendChild(rowContainer[i]);

    for (j = 0; j < numSquaresPerSide; j++) {
      let div = document.createElement("div");
      div.classList.add("grid");
      div.style.width = `${adjustedGridDim / numSquaresPerSide}px`;
      div.style.height = `${adjustedGridDim / numSquaresPerSide}px`;
      // div.classList.add('white');
      div.style.backgroundColor = hue2hsl(bgColorValue);
      div.style.border = `${innerGridLinesDim}px solid lightgray`;

      if (j === 0) {
        div.style.borderLeft = `${outerGridLinesDim}px solid black`;
      } else if (j > numSquaresPerSide - 2) {
        div.style.borderRight = `${outerGridLinesDim}px solid black`;
      }

      if (i === 0) {
        div.style.borderTop = `${outerGridLinesDim}px solid black`;
      } else if (i > numSquaresPerSide - 2) {
        div.style.borderBottom = `${outerGridLinesDim}px solid black`;
      }
      rowContainer[i].appendChild(div);
    }
  }
  gridDivs = document.querySelectorAll("div.grid");
  mouseIsDown = false;
  gridDivs.forEach((gridDiv) =>
    gridDiv.addEventListener("mousedown", (e) => {
      mouseIsDown = true;
      draw(e);
    })
  );
  gridDivs.forEach((gridDiv) =>
    gridDiv.addEventListener("mouseup", () => {
      mouseIsDown = false;
    })
  );
  gridDivs.forEach((gridDiv) => gridDiv.addEventListener("mouseover", draw));
}
