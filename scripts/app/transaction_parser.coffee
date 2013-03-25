define ['pdf'], ->

  # We don't need to use workers, it will simplify development
  PDFJS.disableWorker = true

  class TransactionParser

    parse: (data) ->
      PDFJS.getDocument(data)
        .then (pdf) ->
          #Ensure that user loaded Payoneer Transactions list
          if pdf.pdfInfo.info.Title isnt "TransactionList"
            alert("Only Payonner Transaction List supported.")
          else
            alert("Pages: " + pdf.numPages)

      []

