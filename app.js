// Initializing fancy file-input
$("#pdf").filestyle({
  textField: "Upload Transactions PDF file", 
  icon: true,
  classButton: "btn-success"
});


function handleFileSelect(evt) {
  file = evt.target.files[0]; // We support only 1 file at time

  if (file.type !== "application/pdf")
    return alert("Only PDF files supported");  

  // Read more: http://www.html5rocks.com/en/tutorials/file/dndfiles/
  reader = new FileReader();
  
  reader.onload = function(e){
    alert("File loaded");
  }
          
  reader.readAsBinaryString(file);
}

$("#pdf").on('change', handleFileSelect);
