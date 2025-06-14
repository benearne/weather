
const img = document.createElement('img');

input.addEventListener('input', () => {
// Button aktivieren, wenn mindestens 1 Zeichen drin ist
btn.disabled = input.value.trim() === '';
});

const form = document.getElementById("form");
form.addEventListener('submit', function(event) {
	event.preventDefault();
	let searchWord = form.elements['search'].value;
	if (!searchWord) {
		searchWord = 'cat';
	};
	change(searchWord);
	form.reset();
});

async function change(word) {
	img.alt = 'Loading …';
	img.src = '';
	const url = 'https://api.giphy.com/v1/gifs/translate?api_key=2S3m6ziotOEsPmP513PodY8zZunfHILA&s=' + word;
	
	try {
		const response = await fetch(url, {mode: 'cors'});
		const data = await response.json();

		img.src = data.data.images.original.url;
		img.alt = data.data.title || 'cat gif';
	} catch (e) {
		console.log(e)
	} finally {
		console.log('pic changed with keyword ' + word);
	}
};

change('cat');
