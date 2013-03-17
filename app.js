// Initializing fancy file-input
$("#pdf").filestyle({
  textField: "Upload Transactions PDF file", 
  icon: true,
  classButton: "btn-success"
});

// We don't need to use workers, it will simplify development
PDFJS.disableWorker = true

// Using https://github.com/mozilla/pdf.js
function parsePDF(data) {
  PDFJS.getDocument(data).then(function(pdf){    
    // Ensure that user loaded Payoneer Transactions list
    if (pdf.pdfInfo.info.Title !== "TransactionList") {
      return alert("Wrong PDF. Only Payonner Transaction List supported.") 
    } 

    alert("Pages: " + pdf.numPages)
  })
}

function handleFileSelect(evt) {
  file = evt.target.files[0]; // We support only 1 file at time

  if (file.type !== "application/pdf")
    return alert("Only PDF files supported");  

  // Read more: http://www.html5rocks.com/en/tutorials/file/dndfiles/
  reader = new FileReader();
  
  reader.onload = function(e){
    data = e.target.result;

    parsePDF(data);
  }
            
  reader.readAsArrayBuffer(file);
}

$("#pdf").on('change', handleFileSelect);
