var TransactionsView = TV = {

  tableTMPL: _.template(" \
    <h1>Transactions from 01.<%=month%>.<%=year%></h1> \
    <table class='table table-striped'> \
      <thead> \
        <th>Date</th> \
        <th>Name</th> \
        <th>Amount</th> \
      </thead> \
      <tbody> \
        <% _.each(transactions, function(t){ %> \
          <tr> \
            <td><%=t.date.toDateString()%></td> \
            <td><%=t.name%></td> \
            <td><%=t.amount%></td> \
          </tr> \
        <% }) %> \
      </tbody> \
    </table> \
  "),


  renderTransactionTable: function(date, transactions) {
    year  = date.split(':')[0];
    month = date.split(':')[1];

    html = this.tableTMPL({
      month: month,
      year: year,

      transactions: transactions
    })

    $('#transactions').append(html)
  },

  render: function(transactions) {
    $('#transactions tbody').html('')

    // Grouping by month    
    grouped = _.groupBy(transactions, function(t){ 
      return t.date.getFullYear() + ":" + (t.date.getMonth()+1)
    });

    for (date in grouped) {
      this.renderTransactionTable(date, grouped[date]);
    }

    $('#transactions').show()
  }  

}