// console.log("clinet side js is here")
// $('body').append($('<p>Hey JQ</p>'))

const deleteItem = (itemId) => {
	$.ajax({
		url: '/items/j/' + itemId,
		method: 'DELETE',
		dataType: 'JSON',
		success: getItems,
		fail: (err) => {
			console.error
		}
	})
}
const editItem = (itemId) => {
	console.log("Edit forthcoming. Item " + itemId)
}

$('#items').on('click', 'li', (event) => {
	const itemId = $(event.currentTarget).data('thisitem');
	const action = $(event.target).data('action');

	if(action=="delete") deleteItem(itemId);
	if(action=="edit") editItem(itemId);
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
	// remove old list
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
