// console.log("clinet side js is here")
// $('body').append($('<p>Hey JQ</p>'))


printResults = (data) => {
	const theItems = data.items;
	data.items.forEach((item) => {
		const $item = $('<li data-thisitem="' + item.id + '">');
		$item.text(item.title);
		$item.append($('<button>Delete</button>'));
		$item.append($('<a href="#">Edit</a>'))
		$('#items').append($item)
	});	
}

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