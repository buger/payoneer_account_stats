var TransactionsView = {

  render: function(transactions) {
    var html = [];

    for (var i=0; i<transactions.length; i++) {
      t = transactions[i];

      html.push(
        "<tr>\
          <td>"+t.date+"</td>\
          <td>"+t.name+"</td>\
          <td>"+t.amount+"</td>\
        </tr>"
      )
    }

    $('#transactions tbody').html(html.join(''))
    $('#transactions').show()
  }

}