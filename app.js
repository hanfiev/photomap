function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === 'file') {
        const file = item.getAsFile();
        console.log(`… file[${i}].name = ${file.name}`);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}

function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  a.push(dd)
  return dd;
}



document.getElementById("photo").onchange = function (e) {
  console.log(e.target.files)
  if (e.target.files[0].name.toLowerCase().endsWith(".heic")) {
    var reader = new FileReader();

    reader.onload = function () {
      var tags = findEXIFinHEIC(reader.result);
      console.log(tags["GPSLatitude"][0])
      var latitudeComponents = tags["GPSLatitude"];
      var latitudeRef = tags["GPSLatitudeRef"];
      var longitudeComponents = tags["GPSLongitude"];
      var longitudeRef = tags["GPSLongitudeRef"];

      ConvertDMSToDD(tags["GPSLatitude"][0], tags["GPSLatitude"][1], tags["GPSLatitude"][2], tags["GPSLatitudeRef"])
      ConvertDMSToDD(tags["GPSLongitude"][0], tags["GPSLongitude"][1], tags["GPSLongitude"][2], tags["GPSLongitudeRef"])

      document.getElementById("gps-coordinates").innerHTML = "The picture was taken at " + latitudeComponents + " " + latitudeRef + ", " + longitudeComponents + " " + longitudeRef + ".";
    };

    reader.readAsArrayBuffer(e.target.files[0]);
  }
}
let a = []

 function readFileAsText(file){
  return new Promise(function(resolve,reject){
      let fr = new FileReader();

      fr.onload = function(){
        var tags = findEXIFinHEIC(fr.result);
        console.log(tags["GPSLatitude"][0])
        var latitudeComponents = tags["GPSLatitude"];
        var latitudeRef = tags["GPSLatitudeRef"];
        var longitudeComponents = tags["GPSLongitude"];
        var longitudeRef = tags["GPSLongitudeRef"];
  
        ConvertDMSToDD(tags["GPSLatitude"][0], tags["GPSLatitude"][1], tags["GPSLatitude"][2], tags["GPSLatitudeRef"])
        ConvertDMSToDD(tags["GPSLongitude"][0], tags["GPSLongitude"][1], tags["GPSLongitude"][2], tags["GPSLongitudeRef"])

        
  
        document.getElementById("gps-coordinates").innerHTML = "The picture was taken at " + latitudeComponents + " " + latitudeRef + ", " + longitudeComponents + " " + longitudeRef + ".";
      };

      fr.onerror = function(){
          reject(fr);
      };

      fr.readAsArrayBuffer(file);
  });
}

// Handle multiple fileuploads
document.getElementById("fileinput").addEventListener("change", function(ev){
  let files = ev.currentTarget.files;
  let readers = [];

  // Abort if there were no files selected
  if(!files.length) return;

  // Store promises in array
  for(let i = 0;i < files.length;i++){
      readers.push(readFileAsText(files[i]));
  }
  
  // Trigger Promises
  Promise.all(readers).then((values) => {
      // Values will be an array that contains an item
      // with the text of every selected file
      // ["File1 Content", "File2 Content" ... "FileN Content"]
      console.log(values);
  });
}, false);