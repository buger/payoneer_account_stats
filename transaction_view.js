var TransactionsView = {

  transactionCategories: {},

  // http://underscorejs.org/#template
  tableTMPL: _.template(" \
    <h1>Transactions from 01.<%=month%>.<%=year%></h1> \
    <ul class='totals'> \
      <% _.each(categories, function(c){ %> \
        <li><%=c[0]%>: <%=c[1]%></li> \
      <% }) %> \
    </ul> \
    <table class='table table-striped'> \
      <thead> \
        <th>Date</th> \
        <th>Name</th> \
        <th>Amount</th> \
        <th>Category</th> \
      </thead> \
      <tbody> \
        <% _.each(transactions, function(t){ %> \
          <tr> \
            <td class='date'><%=t.date.toDateString()%></td> \
            <td class='name'><%=t.name%></td> \
            <td class='amount'><%=t.amount%></td> \
            <td> \
              <div class='btn-group'> \
                <a class='btn btn-primary' href='#'><%=t.category%></a> \
                <a class='btn btn-primary dropdown-toggle' data-toggle='dropdown' href='#''><span class='caret'></span></a> \
                <ul class='dropdown-menu'> \
                  <% _.each(category_types, function(t){ %> \
                    <li><a href='#'><i class='i'></i><%=t%></a></li> \
                  <% }) %> \
                  <li class='divider'></li> \
                  <li><a href='#' class='new_category'><i class='icon-plus-sign'></i> New category</a></li> \
                </ul> \
              </div> \
            </td> \
          </tr> \
        <% }) %> \
      </tbody> \
    </table> \
  "),

  
  categoryTypes: function(){
    var category_types = _.values(this.transactionCategories).sort();
    category_types.push("Other");

    return _.uniq(category_types);
  },


  getTotals: function(transactions) {
    categories = {}

    for (var i=0; i<transactions.length; i++) {
      var category = transactions[i].category;

      if (!categories[category])
        categories[category] = 0;

      categories[category] += transactions[i].amount;
    }

    // Sort categories by price
    // _.pair turns hash into array of tuples: [[key,value], ...]
    categories = _.sortBy(_.pairs(categories), function(c){ return c[1] });

    return categories;
  },


  renderTransactionTable: function(date, transactions) {
    year  = date.split(':')[0];
    month = date.split(':')[1];

    transactions = transactions.map(function(t){
      t.category = this.transactionCategories[t.name] || "Other";

      return t;
    }.bind(this));

    html = this.tableTMPL({
      month: month,
      year: year,

      transactions: transactions,

      categories: this.getTotals(transactions),

      category_types: this.categoryTypes()
    });

    return html;
  },

  render: function(transactions) {
    this.transactions = transactions;

    // Grouping by month
    // http://underscorejs.org/#groupBy
    grouped = _.groupBy(transactions, function(t){ 
      return t.date.getFullYear() + ":" + (t.date.getMonth()+1)
    });

    var html = "";

    for (date in grouped) {
      html += this.renderTransactionTable(date, grouped[date]);
    }

    // Showing table only after it get rendered    
    $('#transactions').html(html).show()
  },

  bindEvents: function(){
    $('#transactions').on('click', ".dropdown-menu a", function(evt){
      var link = evt.currentTarget;

      name = $(link).parents('tr').find('td.name').text();

      console.warn(link.className)

      if (link.className.indexOf('new_category') != -1) {
        category = prompt("Enter new category name for '"+name+"'");
      } else {
        category = link.text;
      }

      this.transactionCategories[name] = category;

      this.render(this.transactions); 

      return false;           
    }.bind(this))
  }

}

// Need to be called only once, since we using event delegation
// http://api.jquery.com/delegate/
TransactionsView.bindEvents();