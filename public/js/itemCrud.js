// console.log("clinet side js is here")
// $('body').append($('<p>Hey JQ</p>'))


$('#items').on('click', 'li', (event) => {
	console.log($(event.currentTarget).data('thisitem'));
	console.log($(event.target).data('action'));
})


$('#add-item').on('click', (event) => {

	const title = $('#new-item').val();

	// send a post request
	$.ajax({
		url: '/items/j',
		method: 'POST', 
		dataType: 'JSON',
		data: {
			title: title
		}, 
		success: (data) => {
			$('#new-item').val("");
			getItems();
		}, 
		fail: (err) => {
			console.log('post is broke', err)
		}
	})
})

const getItems = () => {
	// index
	$.ajax({
		url: '/items/j',
		method: 'GET',
		dataType: 'JSON',
		success: printResults, 
		fail: (err) => {
			console.error('index/get is broke', err)
		}
	})
}

const printResults = (data) => {
	$('#items').empty();
	const theItems = data.items;
	data.items.forEach((item) => {
		const $item = $('<li data-thisitem="' + item.id + '">');
		$item.text(item.title);
		$item.append($('<button data-action="delete">Delete</button>'));
		$item.append($('<a href="#" data-action="edit">Edit</a>'))
		$('#items').append($item)
	});	
}

getItems();
