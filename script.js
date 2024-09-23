var camWidth = "";
var camHeight = "";
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  camWidth = 360;
  camHeight = 500;
  // true for mobile device
  //document.write("mobile device");
} else {
  // camWidth = 500;
  // camHeight = 360;
  camWidth = 360;
  camHeight = 500;
  // false for not mobile device
  // document.write("not mobile device");
}
const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const webcam = new Webcam(webcamElement, "user", canvasElement);

webcamElement.width = camWidth;
webcamElement.height = camHeight;
function CameraInit() {
  $(".firstpage").hide();
  $(".cameraPanel").show();
  webcam
    .start()
    .then((result) => {
      console.log("webcam started", result);
    })
    .catch((err) => {
      console.log(err);
    });
}
const dropdown = document.getElementById("dynamicDropdown");
function CamSettings() {
  if ($(".setpanel").is(":visible")) {
    $(".setpanel").hide();
  } else {
    dropdown.innerHTML = "";
    const numberOfElements = webcam.webcamCount;
    console.log(numberOfElements);
    for (let i = 1; i <= numberOfElements; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = removeBracketsAndContent(
        webcam.webcamList[i - 1].label
      );
      dropdown.appendChild(option);
    }
    $(".setpanel").show();
  }
}
function removeBracketsAndContent(str) {
  return str.replace(/\s*\(.*?\)\s*/g, "").trim();
}
dropdown.addEventListener("change", function () {
  handleOptionChange(dropdown.value);
});
function handleOptionChange(selectedValue) {
  console.log(`Selected value: ${selectedValue}`);
  webcam.stop();
  webcam._selectedDeviceId = webcam.webcamList[selectedValue - 1].deviceId;
  webcam
    .start()
    .then((result) => {
      console.log("webcam started");
    })
    .catch((err) => {
      console.log(err);
    });
}
toggleSwitch.addEventListener("change", function () {
  if (toggleSwitch.checked) {
    console.log("Switch is ON");
    webcamElement.setAttribute("style", "transform: scale(1,1)!important;");
  } else {
    console.log("Switch is OFF");
    webcamElement.setAttribute("style", "transform: scale(-1,1)!important;");
  }
});
// settings code ends here
function TakePhoto() {
  var picture = webcam.snap();
  $("#webcam").hide();
  canvasElement.style.display = "block";
  webcam.stop();
  $(".capturebtn").hide();
  $(".finalize").show();
}
function RetakePhoto() {
  webcam
    .start()
    .then((result) => {
      console.log("webcam started");
    })
    .catch((err) => {
      console.log(err);
    });
  $("#webcam").show();
  $("#canvas").hide();
  $(".capturebtn").show();
  $(".finalize").hide();
}

function FinalPhoto() {
  $(".cameraPanel").hide();
  $(".supeImgs").show();
}
function SwapFace(item) {
  console.log("testing...");
  // const canvas = document.getElementById("canvas");
  // const ctx = canvas.getContext("2d");
  // const dataURL = canvas.toDataURL("image/png");
  // const substringToRemove = "data:image/png;base64,";

  // const parts = dataURL.split(substringToRemove);
  // var newString = parts.join("");
  // const imagePath = "assets/supe/" + item.id + ".jpg"; // Change this to the path of your image

  // fetch(imagePath)
  //   .then((response) => response.blob())
  //   .then((blob) => {
  //     const reader = new FileReader();
  //     reader.onloadend = function () {
  //       const base64String = reader.result;
  //       //
  //       const substringToRemove2 = "data:image/jpeg;base64,";
  //       const parts2 = base64String.split(substringToRemove2);
  //       var newString2 = parts2.join("");
  //       const settings = {
  //         async: true,
  //         crossDomain: true,
  //         url: "https://facehub-ai-face-swap.p.rapidapi.com/swap",
  //         method: "POST",
  //         headers: {
  //           "content-type": "application/json",
  //           "X-RapidAPI-Key":
  //             "9191f0118bmsh51869036b0344f2p1841f9jsn9101364c60ca",
  //           "X-RapidAPI-Host": "facehub-ai-face-swap.p.rapidapi.com",
  //         },
  //         processData: false,
  //         data:
  //           '{\r"source": "' +
  //           newString +
  //           '",\r"target": "' +
  //           newString2 +
  //           '"\r}',
  //       };

  //       $.ajax(settings).done(function (response) {
  //         console.log(response.result);
  //         const img = new Image();
  //         img.src = "data:image/png;base64," + String(response.result);

  //         // Display the image in the image container
  //         const imageContainer =
  //           document.getElementById("imageContainer");
  //         imageContainer.innerHTML = ""; // Clear previous content
  //         imageContainer.appendChild(img);
  //       });
  //     };
  //     reader.readAsDataURL(blob);
  //   })
  //   .catch((error) => console.error("Error:", error));
}
