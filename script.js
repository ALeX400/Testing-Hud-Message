document.addEventListener('DOMContentLoaded', function () {
	const hudText = document.getElementById('hudText');
	const codePreview = document.getElementById('codePreview');

	hudText.style.left = '0px';
	hudText.style.top = '0px';
	updateCode(0, 0, hudText.textContent, 255, 0, 0);

	let offsetX = 0;
	let offsetY = 0;
	let drag = false;

	function updateCode(x, y, text, red, green, blue) {
		let xValue, yValue;
		if (x === -1) {
			xValue = -1; // Centrat pe axa X
		} else {
			xValue = parseFloat((Math.max(0, Math.min(x, 1))).toFixed(3));
		}

		if (y === -1) {
			yValue = -1; // Centrat pe axa Y
		} else {
			yValue = parseFloat((Math.max(0, Math.min(y, 1))).toFixed(3));
		}

		const codeString = `set_hudmessage(${red}, ${green}, ${blue}, ${xValue}, ${yValue}, 0, 6.0, 12.0)`;
		codePreview.textContent = codeString;
	}

	hudText.addEventListener('mousedown', function (e) {
		drag = true;
		offsetX = e.clientX - hudText.getBoundingClientRect().left;
		offsetY = e.clientY - hudText.getBoundingClientRect().top;
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	});
	function onMouseMove(e) {
		if (drag) {
			// Noile poziții ale mouse-ului, ajustate relativ la containerul hudPreview
			let newX = e.clientX - offsetX - hudPreview.getBoundingClientRect().left;
			let newY = e.clientY - offsetY - hudPreview.getBoundingClientRect().top;

			// Asigurăm că textul rămâne în limitele hudPreview
			newX = Math.max(0, Math.min(newX, hudPreview.clientWidth - hudText.offsetWidth));
			newY = Math.max(0, Math.min(newY, hudPreview.clientHeight - hudText.offsetHeight));

			hudText.style.left = newX + 'px';
			hudText.style.top = newY + 'px';

			// Convertim poziția în procente pentru `set_hudmessage`
			const xPercent = newX / (hudPreview.clientWidth - hudText.offsetWidth);
			const yPercent = newY / (hudPreview.clientHeight - hudText.offsetHeight);

			const currentColor = window.lastSelectedColor || { r: 255, g: 0, b: 0 };
			updateCode(xPercent, yPercent, hudText.textContent, currentColor.r, currentColor.g, currentColor.b);
		}
	}

	function onMouseUp() {
		drag = false;
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	}


	// Funcția pentru ajustarea incrementării și decrementării
	document.getElementById('xPos').addEventListener('keydown', handleIncrementDecrement);
	document.getElementById('yPos').addEventListener('keydown', handleIncrementDecrement);

	function handleIncrementDecrement(event) {
		const input = event.target;
		let value = parseFloat(input.value);
		const key = event.key;

		// Prevenim comportamentul implicit pentru a controla manual incrementarea/decrementarea
		if (key === "ArrowUp" || key === "ArrowDown") {
			//event.preventDefault();

			if (value === 0 && key === "ArrowUp") {
				event.preventDefault();
				// Incrementăm cu 0.01 dacă valoarea curentă este 0 și se apasă săgeata în sus
				input.value = (value + 0.1).toFixed(2);
			} else if (value > 0 && key === "ArrowUp") {
				event.preventDefault();
				// Continuăm să incrementăm cu 0.01 dacă valoarea este deja peste 0
				input.value = (value + 0.1).toFixed(2);
			} else if (value > 0 && key === "ArrowDown") {
				event.preventDefault();
				// Continuăm să incrementăm cu 0.01 dacă valoarea este deja peste 0
				input.value = (value - 0.1).toFixed(2);
			} else if (value === 0 && key === "ArrowDown") {
				input.value = -1;
			} else if (value === -1 && key === "ArrowUp") {
				event.preventDefault();
				input.value = 0;
			} else if (value === -1 && key === "ArrowDown") {
				input.value = -1;
			} else if (value === -0.1 && key === "ArrowDown") {
				input.value = -1;
			} else if (value < 0 && key === "ArrowDown") {
				input.value = (value - 1).toFixed(2);
			}
		}
	}

	document.getElementById('setPosition').addEventListener('click', function () {
		const xPos = parseFloat(document.getElementById('xPos').value);
		const yPos = parseFloat(document.getElementById('yPos').value);
		const currentColor = window.lastSelectedColor || { r: 255, g: 0, b: 0 };

		// Calculează noua poziție în pixeli sau centrază textul dacă valorile sunt -1
		let newX, newY;
		if (xPos === -1) {
			newX = (hudPreview.offsetWidth - hudText.offsetWidth) / 2; // Centrează pe axa X
		} else {
			newX = xPos * hudPreview.offsetWidth;
		}

		if (yPos === -1) {
			newY = (hudPreview.offsetHeight - hudText.offsetHeight) / 2; // Centrează pe axa Y
		} else {
			newY = yPos * hudPreview.offsetHeight;
		}

		hudText.style.left = `${newX}px`;
		hudText.style.top = `${newY}px`;

		// Convertim din pixeli înapoi în procente pentru updateCode
		updateCode(xPos, yPos, hudText.textContent, currentColor.r, currentColor.g, currentColor.b);
	});

	hudText.addEventListener('contextmenu', function (e) {
		e.preventDefault();
		const colors = [
			{ r: 255, g: 0, b: 0 }, // Red
			{ r: 0, g: 0, b: 255 }, // Blue
			{ r: 0, g: 255, b: 0 }, // Green
			{ r: 255, g: 255, b: 0 }, // Yellow
			{ r: 255, g: 165, b: 0 }, // Orange
			{ r: 128, g: 0, b: 128 }  // Purple
		];

		const colorPalette = createColorPalette(e.pageX, e.pageY, colors);
		document.body.appendChild(colorPalette);

		function createColorPalette(x, y, colors) {
			closeColorPalette();
			const palette = document.createElement('div');
			palette.className = 'color-palette';
			palette.style.left = `${x}px`;
			palette.style.top = `${y}px`;

			colors.forEach(color => {
				const swatch = document.createElement('div');
				swatch.className = 'color-swatch';
				swatch.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
				swatch.addEventListener('click', function () {
					window.lastSelectedColor = color;
					hudText.style.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
					updateCode(parseFloat(hudText.style.left) / hudText.parentElement.offsetWidth, parseFloat(hudText.style.top) / hudText.parentElement.offsetHeight, hudText.textContent, color.r, color.g, color.b);
					closeColorPalette();
				});
				palette.appendChild(swatch);
			});

			return palette;
		}

		document.addEventListener('click', closeColorPalette, { once: true });
	});

	function closeColorPalette() {
		const existingPalette = document.querySelector('.color-palette');
		if (existingPalette) {
			document.body.removeChild(existingPalette);
		}
	}
});
