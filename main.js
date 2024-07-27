window.onload = function () {
  // Initialize the canvas and context
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // Create a new image element
  const img = new Image();
  img.crossOrigin = "anonymous";

  // Set the source of the image
  img.src =
    "https://raw.githubusercontent.com/khoituan-desygner/nhnhnh/master/nhnhnh.jpg";

  // Variables to store image dimensions
  let imgWidth, imgHeight;

  // Draw the image onto the canvas once it's loaded
  img.onload = function () {
    imgWidth = img.width;
    imgHeight = img.height;
    drawCanvas(); // Initial draw
  };

  // Handle error
  img.onerror = function (err) {
    window.alert("Failed to load image.", err);
  };

  // Function to draw the entire canvas
  function drawCanvas() {
    // Set the background color
    ctx.fillStyle = "#fefefe";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the image
    ctx.drawImage(img, 0, canvas.height - imgHeight, imgWidth, imgHeight);

    // Draw the text if any
    let text = inputBox.value.trim();
    if (text) {
      // Convert the input text using convertSentence function
      text = convertSentence(text);

      // Set font properties
      ctx.font = "60px Gluten";
      ctx.fillStyle = "hotpink";
      ctx.strokeStyle = "purple";

      // Draw the text on the canvas with word wrapping
      wrapText(ctx, text, 50, 100, canvas.width - 100, 50);
    }
  }

  // Function to export the canvas as an image
  function exportCanvas() {
    // Ensure the canvas is fully drawn before exporting
    drawCanvas();

    // Get the data URL for the image
    const dataURL = canvas.toDataURL("image/png");

    // Create a link element
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-image.png"; // Set the default file name

    // Trigger the download by simulating a click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Add event listener to the button to export the canvas as an image
  document.getElementById("download").addEventListener("click", function () {
    // var imageContainer = document.getElementById("myCanvas");
    // Create a new image element
    var img = document.createElement("img");

    // Set the image source
    const src = canvas.toDataURL("image/png");

    img.src = src;

    // // Optionally set other attributes like width and height
    // img.width = canvas.width;
    // img.height = canvas.height;

    // // Append the image to the container
    // imageContainer.appendChild(img);
    img.onload = () => {
      document.body.appendChild(img);
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
            window.alert("Exceed maximum length!");
          }

          drawCanvas(); // Redraw canvas on input change
        });
      });
    })
    .catch(function (e) {
      console.error("Font loading failed:", e);
    });

  // Function to wrap text
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let testLine;
    let testWidth;
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      testLine = line + words[i] + " ";
      testWidth = context.measureText(testLine).width;
      if (testWidth > maxWidth && i > 0) {
        if (currentY + lineHeight > canvas.height) {
          return; // Text exceeds canvas height
        }
        context.fillText(line, x, currentY);
        context.strokeText(line, x, currentY);
        line = words[i] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
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
  }

  document.getElementById("clear").addEventListener("click", clearText);
};
