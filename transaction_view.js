var TransactionsView = {

  transactionCategories: {},

  // http://underscorejs.org/#template
  tableTMPL: _.template(" \
    <h1>Transactions from 01.<%=month%>.<%=year%></h1> \
    <div id='chart_<%=period%>'></div> \
    <table class='table table-striped'> \
      <thead> \
        <th>Date</th> \
        <th>Name</th> \
        <th>Amount</th> \
        <th>Category</th> \
      </thead> \
      <tbody> \
        <% _.each(transactions, function(t){ %> \
          <tr class='<%=t.category == 'Other' ? 'warning' : '' %>'> \
            <td class='date'><%=t.date.toDateString()%></td> \
            <td class='name'><%=t.name%></td> \
            <td class='amount'><%=t.amount.toFixed(2)%></td> \
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

  graphOptions: {
    chart: {
      renderTo: 'UNSET',
    },
    credits: { 
      enabled: false 
    },
    title: {
      text: null
    },
    tooltip: {
      pointFormat: 'Spent: <b>${point.y}</b>',
      percentageDecimals: 2
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      layout: 'vertical',
      labelFormatter: function(){ 
        return this.name + ": $" + this.y.toFixed(2) 
      },
      y: 40,
      x: -300
    },
    plotOptions: {
      pie: { 
        animation: false,
        showInLegend: true,
        center: [200,180]
      }
    },
    series: [{
      type: 'pie',
      name: 'Transactions stats',
      data: 'UNSET'
    }]
  },

  
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


  renderTransaction: function(period, transactions) {
    year  = period.split(':')[0];
    month = period.split(':')[1];

    transactions = transactions.map(function(t){
      t.category = this.transactionCategories[t.name] || "Other";

      return t;
    }.bind(this));

    html = this.tableTMPL({
      period: period,

      month: month,
      year: year,

      transactions: transactions,      

      category_types: this.categoryTypes()
    });

    var div = document.createElement('div');
    div.innerHTML = html;

    // All our functions is synchronious `setTimeout(func(){...},0)` will be called right after browser render 
    setTimeout(function(){
      options = this.graphOptions
      options.chart.renderTo = 'chart_'+period;
      options.series[0].data = this.getTotals(transactions);

      new Highcharts.Chart(options);
    }.bind(this), 0)

    return div;
  },

  render: function(transactions) {
    var dom = document.createDocumentFragment();

    this.transactions = transactions;

    // Grouping by month
    // http://underscorejs.org/#groupBy
    grouped = _.groupBy(transactions, function(t){ 
      return t.date.getFullYear() + ":" + (t.date.getMonth()+1)
    });

    for (date in grouped) {
      dom.appendChild(this.renderTransaction(date, grouped[date]));
    }

    // Showing table only after it get rendered    
    $('#transactions').html(dom).show()
  },

  bindEvents: function(){
    $('#transactions').on('click', ".dropdown-menu a", function(evt){
      var link = evt.currentTarget;

      name = $(link).parents('tr').find('td.name').text();

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