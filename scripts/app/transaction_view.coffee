define ['jquery'], ($) -> 

	class TransactionView

		container: $('#transactions')

		render: (transactions) ->
			@transactions = transactions

			@container.html('Place for transactions')
