define ['jquery', 'cs!app/transaction_parser','cs!app/transaction_view'], ($, TP, TV) ->

  class App

    constructor: ->
      @parser = new TP
      @view = new TV

      $("#pdf").on 'change', _.bind(@handleFileSelect, @)


    render: (transactions) ->
      @view.render transactions


    handleFileSelect: (evt) ->
      file = evt.target.files[0] # We support only 1 file at time

      if file.type isnt "application/pdf"
        alert("Only PDF files supported")
      else
        #Read more: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        reader = new FileReader()
      
        reader.onload = (e) =>
          data = e.target.result

          @render @parser.parse(data)

                  
        reader.readAsArrayBuffer(file)

