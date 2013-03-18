// 
//  Parsing PDF using using https://github.com/mozilla/pdf.js
//

var TransactionParser = TP = {
  
  transactions: [],

  parseTransactions: function(textContent) {
    var deferred = Q.defer();

    var items = textContent.bidiTexts;
    var found_transactions = false;          

    for (var i=0; i<items.length; i++) {
      if (!found_transactions) {            
        found_transactions = items[i].str == "Currency";
        continue
      }

      TP.transactions.push({
        date: items[i].str,
        name: items[++i].str,
        amount: items[++i].str,
        currency: items[++i].str
      })
    }

    deferred.resolve();

    return deferred;
  },

  getText: function(page) {    
    return page.getTextContent()
  },
  
  init: function(data) {
    return PDFJS.getDocument(data).then(TP.parsePDF)
  },

  parsePDF: function(pdf){
    // Ensure that user loaded Payoneer Transactions list
    if (pdf.pdfInfo.info.Title !== "TransactionList") {
      return alert("Wrong PDF. Only Payonner Transaction List supported.") 
    } 

    var total_pages = pdf.pdfInfo.numPages;

    var promises = [];

    // Note that pages start from 1
    for (var page_num = 1; page_num <= total_pages; page_num++) {    

      promises.push(
        pdf.getPage(page_num)
        .then(TP.getText)
        .then(TP.parseTransactions)
      )

    }

    return Q.allResolved(promises)
  }

}

