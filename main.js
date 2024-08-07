// Initialize the canvas and context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Create a new image element
const img1 = new Image();
img1.crossOrigin = "anonymous";
img1.src =
  "https://raw.githubusercontent.com/maihunga1/maihunga1.github.io/master/nhnhnh.jpg";

const img2 = new Image();
img2.crossOrigin = "anonymous";
img2.src =
  "https://github.com/maihunga1/maihunga1.github.io/blob/main/phongcach.png?raw=true";

let selectedImage = img1;

img1.onload = function () {
  drawCanvas();
};

document.querySelectorAll('input[name="image"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.id === "image1") {
      selectedImage = img1;
    } else {
      selectedImage = img2;
    }
    drawCanvas();
  });
});

// Handle error
img1.onerror = function (err) {
  window.alert("Failed to load image.", err);
};

img2.onerror = function (err) {
  window.alert("Failed to load image.", err);
};

// Function to draw the entire canvas
function drawCanvas() {
  // Set the background color
  ctx.fillStyle = "#fefefe";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the image
  ctx.drawImage(
    selectedImage,
    0,
    canvas.height - selectedImage.height,
    selectedImage.width,
    selectedImage.height
  );

  // Draw the text if any
  let text = inputBox.value.trim();
  if (text) {
    // Convert the input text using convertSentence function
    text = convertSentence(text);

    // Set font properties
    ctx.font = "30px Gluten";
    ctx.fillStyle = "hotpink";
    ctx.strokeStyle = "purple";

    // Draw the text on the canvas with word wrapping
    wrapText(ctx, text, 30, 50, canvas.width - 50, 50);
  }
}

// Add event listener to the button to export the canvas as an image
document.getElementById("download").addEventListener("click", function () {
  // Create a new image element
  var img = document.getElementById("exported-img");

  // Set the image source
  const src = canvas.toDataURL("image/png");

  img.src = src;

  // Display the exported image
  img.onload = () => {
    img.style.display = "";
    document.getElementById("myCanvas").style.display = "none";
    document.getElementById("instruction").style.display = "";
  };
});

const inputBox = document.getElementById("input-box");
const charCount = document.getElementById("char-count");

// Load the Gluten font using FontFaceObserver
const font = new FontFaceObserver("Gluten");

font
  .load()
  .then(function () {
    console.log("Font loaded");

    // Ensure the font is fully loaded before rendering anything
    document.fonts.ready.then(() => {
      // Add event listener for the input box
      inputBox.addEventListener("keypress", (event) => {
        if (event.key !== "Enter") return;
        drawCanvas();
      });

      // Update character count on input
      inputBox.addEventListener("input", () => {
        const textLength = inputBox.value.length;
        charCount.textContent = `${textLength}/150`;

        if (textLength >= 150) {
          window.alert("Viết ít ít thôi!!");
        }

        drawCanvas(); // Redraw canvas on input change
      });
    });
  })
  .catch(function (e) {
    console.error("Font loading failed:", e);
  });

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";
    let testWidth = context.measureText(testLine).width;

    if (testWidth > maxWidth) {
      if (context.measureText(words[i]).width > maxWidth) {
        let wordWidth = 0;
        for (let j = 0; j < words[i].length; j++) {
          const charWidth = context.measureText(words[i][j]).width;
          if (wordWidth + charWidth > maxWidth) {
            context.fillText(line, x, currentY);
            context.strokeText(line, x, currentY);
            line = words[i][j];
            wordWidth = charWidth;
            currentY += lineHeight;
          } else {
            line += words[i][j];
            wordWidth += charWidth;
          }
        }
      } else {
        context.fillText(line, x, currentY);
        context.strokeText(line, x, currentY);
        line = words[i] + " ";
        currentY += lineHeight;
      }
    } else {
      line = testLine;
    }
  }

  // Draw the last line
  context.fillText(line, x, currentY);
  context.strokeText(line, x, currentY);
}

const vietnameseVowels = ["u", "e", "o", "a", "i", "y"];

const removeDiacritics = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const indexOfFirstVowel = (word) => {
  for (let i = 0; i < word.length; i++) {
    if (vietnameseVowels.includes(removeDiacritics(word[i]).toLowerCase())) {
      return i;
    }
  }
  return -1;
};

const processWord = (word) => {
  word = word.trim();

  if (word === "") return "";

  const shouldCapitalise = word[0] === word[0].toUpperCase();

  const prefix = shouldCapitalise ? "Nh" : "nh";

  const index = indexOfFirstVowel(word);

  if (index === -1) {
    return word;
  }

  return prefix + word.slice(index).toLowerCase();
};

const processLine = (line) => {
  return line.split(" ").map(processWord).join(" ");
};

const convertSentence = (sentence) => {
  return processLine(sentence);
};

function clearText() {
  inputBox.value = "";
  charCount.textContent = "0/150";
  drawCanvas();
  document.getElementById("myCanvas").style.display = "";
  document.getElementById("exported-img").style.display = "none";
  document.getElementById("instruction").style.display = "none";
}

document.getElementById("clear").addEventListener("click", clearText);
