import './style.css';

async function getData(location) {
	location = location || "Vienna";
	const key = "QV5HNS4LGX3YUCEUL26XPBJMN";
	const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${key}&unitGroup=metric&include=current`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		return json;
	} catch (error) {
		console.error(error.message);
	}
}

function extractData(rawData) {
	if (!rawData || !rawData.currentConditions) {
		console.error("Ungültige Datenstruktur");
		return null;
	}

	return {
		conditions: rawData.currentConditions.conditions,
		temp: rawData.currentConditions.temp,
		snow: rawData.currentConditions.snow,
		city: rawData.address,
	}
}

function createForm() {
	const body = document.querySelector("body");

	const header = document.createElement("div");
	header.textContent = "Choose your city!";
	header.id = "header";

	const form = document.createElement("form");

	const label = document.createElement("label");
	label.textContent = "City:"

	const input = document.createElement("input");
	input.type = "text";
	input.name = "city";
	input.placeholder = "Paris, Rome, London …";

	const subBtn = document.createElement("button");
	subBtn.type = "submit";
	subBtn.textContent = "show";
	// subBtn.disaenbled = input.value.trim() === "";

	form.appendChild(label);
	form.appendChild(input);
	form.appendChild(subBtn);

	body.appendChild(header);
	body.appendChild(form);

	return { form, input };
}


async function main(city) {
	const data = await getData(city);
	const extractedData = extractData(data);
	await display(extractedData);
}


const { form, input } = createForm();

form.addEventListener("submit", function(event) {
		event.preventDefault();
		const inputCity = input.value;
		main(inputCity);
		form.reset();
})

async function display(data) {
	const body = document.querySelector("body");

	const oldResults = document.querySelector("#weatherResults");
	if (oldResults) {
		oldResults.remove();
	}

	// New div
	const weatherResults = document.createElement("div");
	weatherResults.id = "weatherResults";

	// Title
	const title = document.createElement("div");
	title.textContent = `The weather in ${data.city}:`;
	title.id = "title"

	// Temperature
	const temperature = document.createElement("div");
	temperature.textContent = `It has ${data.temp} degrees.`
	displayBackground(data.temp);

	// Condition
	const cond = document.createElement("div");
	const lowerCond = data.conditions.toLowerCase();
	cond.textContent = `It is ${lowerCond}.`

	// Giphy
	const keywords = ["cloud", "rain", "snow", "clear", "sun", "fog"]
	const word = keywords.find(word => (lowerCond.includes(word))) || "no data";
	const gif = await giphy(word);

	weatherResults.appendChild(title);
	weatherResults.appendChild(temperature);
	weatherResults.appendChild(cond);
	weatherResults.appendChild(gif);

	body.appendChild(weatherResults);
}

function displayBackground(degree) {
	const body = document.querySelector("body");
  	body.classList.remove("temp-cold", "temp-mild", "temp-warm", "temp-hot");

	if (degree <= 10) {
		body.classList.add("temp-cold");
	} else if (degree <= 20) {
		body.classList.add("temp-mild");
	} else if (degree <= 30) {
		body.classList.add("temp-warm");
	} else {
		body.classList.add("temp-hot");
	}
}


async function giphy(word) {
	const img = document.createElement('img');
	img.alt = 'Loading …';
	img.src = '';
	const url = 'https://api.giphy.com/v1/gifs/translate?api_key=2S3m6ziotOEsPmP513PodY8zZunfHILA&s=' + word;
	
	try {
		const response = await fetch(url, {mode: 'cors'});
		const data = await response.json();
		img.src = data.data.images.original.url;
		img.alt = data.data.title || 'gif';
	} catch (e) {
		console.log(e)
	} finally {
		return img;
	}
};


