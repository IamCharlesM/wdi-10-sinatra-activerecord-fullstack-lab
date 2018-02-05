// console.log("clinet side js is here")
// $('body').append($('<p>Hey JQ</p>'))

const deleteItem = (itemId) => {
	$.ajax({
		url: '/items/j/' + itemId,
		method: 'DELETE',
		dataType: 'JSON',
		success: getItems,
		fail: (err) => {
			console.error(err);
		}
	})
}

const updateItem = (itemId) => {
	console.log("updating item " + itemId);

	const title = $('#update-item').val();

	$.ajax({
		url: '/items/j/' + itemId,
		method: 'PATCH',
		dataType: 'JSON',
		data: {
			title: title
		},
		success: getItems,
		fail: (err) => {
			console.error('patch failed')
		}
	})

}
// this will show a prepopulated input where the user will update the data and press a button that will send a PATCH request to perform the update in the database
const showEditor = (data) => {
	console.log(data)	
	const $items = $("#items li")
	// console.log($items);
	let which; // this will hold the item we want
	for(let i of $items) { // i will refer to this item in the loop (vanilla DOM element)
		// console.log(i)
		let thisIndex = $(i).data('thisitem');
		if(thisIndex==data.item.id) {
			which = i
			break;
		}
	}
	//make our form
	// console.log(which) // this is the item we want to append our form to
	const $theItem = $(which);
	const $form = $('<div>');
	const $input = $('<input id="update-item" type="text" name="title" value="' + data.item.title + '">');
	$form.append($input)
	const $button = $('<button data-action="update">').text('Update Item');
	$form.append($button);
	$theItem.append($form);
}

const editItem = (itemId) => {
	console.log("Edit forthcoming. Item " + itemId);
	$.ajax({
		url: '/items/j/edit/' + itemId,
		method: 'GET',
		dataType: 'JSON',
		success: showEditor,
		fail: (err) => {
			console.error("con't get the ahtem to editt")
		}
	})
}

// event handler for when someone clicks on an LI -- 
// helps the front end figure out wtf the user is even trying to do
$('#items').on('click', 'li', (event) => {
	const itemId = $(event.currentTarget).data('thisitem');
	const action = $(event.target).data('action');

	if(action=="delete") deleteItem(itemId);
	else if(action=="edit") editItem(itemId);
	else if(action=="update") updateItem(itemId);
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
