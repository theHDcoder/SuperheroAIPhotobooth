var albumBucketName = "hdbuckettest";
var bucketRegion = "ap-south-1";
var IdentityPoolId = "ap-south-1:f746089a-16b2-4b75-8d74-3fee63d59c02";

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
  }),
});

var s3 = new AWS.S3({
  apiVersion: "2012-10-17",
  params: { Bucket: albumBucketName },
});
function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000); // Convert seconds to milliseconds
  });
}

//function to send file in S3
function addFileToBucket(albumName, file, fileName) {
  // var files = document.getElementById("photoupload").files;
  //   if (!files.length) {
  //     return alert("Please choose a file to upload first.");
  //   }
  //   var file = files[0];
  var albumPhotosKey = albumName + "/";
  var photoKey = albumPhotosKey + fileName;

  // Use S3 ManagedUpload class as it supports multipart uploads
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: albumBucketName,
      Key: photoKey,
      Body: file,
      ACL: "public-read",
    },
  });

  var promise = upload.promise();

  promise.then(
    function (data) {
      // if (file.type != PDF || file.type != pdf) {
      console.log("Successfully uploaded photo.");
      SupeImageSelectorPanel();
      //finalRender();
      //viewAlbum(albumName);
      // }
    },
    function (err) {
      return alert("There was an error uploading your photo: ", err.message);
    }
  );
}
function convertToHttps(url) {
  if (url.startsWith("http:/")) {
    return url.replace("http:/", "https:/");
  }
  return url; // Return the original URL if it's not http
}
var requestid = "";
async function faceSwap(targetUrl, swapUrl, apiKey) {
  try {
    const data = new URLSearchParams();
    data.append("target_url", targetUrl);
    data.append("swap_url", swapUrl);
    await fetch(
      "https://api.magicapi.dev/api/v1/capix/faceswap/faceswap/v1/image",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-magicapi-key": apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        requestid = responseData.image_process_response.request_id;
        document.getElementById("loader").style.display = "none";
        document.getElementById("loadbtn").style.display = "block";
        // wait(5);
        // responseImage(responseData.image_process_response.request_id, apiKey);
        // Assuming the API returns an image URL in responseData.imageUrl
        //   const imageUrl = responseData.imageUrl; // Adjust this based on the actual response field
        //   document.getElementById("resultImage").src = imageUrl;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    //responseImage();
  } catch (error) {
    console.error("Error:", error);
  }
}
document.getElementById("imgloader").addEventListener("click", test);

function test() {
  document.getElementById("loader").style.display = "flex";
  document.getElementById("loadbtn").style.display = "none";

  responseImage();
}
//async function responseImage(requestId, apiKey) {
async function responseImage() {
  const apiKey = "cm1kwnj6n0001jm03omb9wpfi1111";
  const data = new URLSearchParams();
  data.append("request_id", requestid);

  await fetch("https://api.magicapi.dev/api/v1/capix/faceswap/result/", {
    method: "POST",
    headers: {
      accept: "application/json",
      "x-magicapi-key": apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  })
    .then((response) => response.json())
    .then((responseData) => {
      var imageUrl = responseData.image_process_response.result_url;
      console.log("Final :", imageUrl);
      if (imageUrl != undefined) {
        imageUrl = convertToHttps(imageUrl);
        $(".supeImgs").hide();
        addFileToBucket("AI_photobooth_supe_render", imageUrl, imageUrl);
        document.getElementById("loader").style.display = "none";
        document.getElementById("supePanel").style.display = "none";
        document.getElementById("imageContainer").style.display = "block";
        document.getElementById("resultImage").src = imageUrl;
      } else if (imageUrl == undefined) {
        document.getElementById("loader").style.display = "none";
        document.getElementById("supePanel").style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function generateRandomString(length) {
  // Characters to be included in the random string
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  // Generate random characters by iterating for the length specified
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
//upload code ends

var camWidth = "";
var camHeight = "";

const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const webcam = new Webcam(webcamElement, "user", canvasElement);
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  // webcam.aspectRatio = 9 / 16;
  camWidth = 360;
  camHeight = 500;
  //true for mobile device
  //document.write("mobile device");
} else {
  // camWidth = 500;
  // camHeight = 360;
  camWidth = 360;
  camHeight = 500;
  // false for not mobile device
  // document.write("not mobile device");
}
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
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
function FinalPhoto() {
  addFileToBucket(
    "demo_bucket_cam",
    dataURLtoFile(
      document.getElementById("canvas").toDataURL(),
      "test01" + ".jpeg"
    ),
    "test01" + ".jpeg"
  );
}
function SupeImageSelectorPanel() {
  $(".cameraPanel").hide();
  $(".supeImgs").show();
}
function SwapFace(item) {
  document.getElementById("loader").style.display = "flex";
  $(".supeImgs").hide();
  console.log("testing...", item.id);
  const apiKey = "cm1kwnj6n0001jm03omb9wpfi1111"; // Replace with your actual API key
  faceSwap(
    `https://hdbuckettest.s3.ap-south-1.amazonaws.com/AI_photobooth_supe/${item.id}.png`,
    "https://hdbuckettest.s3.ap-south-1.amazonaws.com/demo_bucket_cam/test01.jpeg",
    apiKey
  );
}

function openTab(event, tabId) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  // Remove active state from all buttons
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((button) => button.classList.remove("active"));

  // Show the current tab content
  document.getElementById(tabId).classList.add("active");

  // Highlight the active button
  event.currentTarget.classList.add("active");
}

// Automatically open the first tab
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".tab-btn").click();
});

function downloadImage() {
  // Get the image element
  const image = document.getElementById("resultImage");

  // Create an anchor element
  const a = document.createElement("a");
  a.href = image.src; // Set href to the image source URL
  a.download = "downloaded_image.jpg"; // Set the file name for download

  // Programmatically click the anchor to trigger the download
  document.body.appendChild(a); // Append the anchor to the document
  a.click(); // Simulate a click to download the image
  document.body.removeChild(a); // Clean up by removing the anchor element
}
document.getElementById("resultImage").onload = function () {
  $(".supeImgs").hide();
};
