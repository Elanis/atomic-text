import fs from 'fs';

const atomicJson = JSON.parse(fs.readFileSync('PeriodicTableJSON.json', 'utf-8'));

const atomicData = {};
for(const atomicElement of atomicJson.elements) {
	atomicData[atomicElement.symbol] = atomicElement;
}
const atomicSymbols = Object.keys(atomicData);

//console.log(atomicData);

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(aOld) {
	const a = JSON.parse(JSON.stringify(aOld));
	let j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

function shuffledTextToAtomic(origin) {
	const result = [];

	let ok = false;
	for(let i = 0; i < origin.length;) {
		const shuffledAtomicSymbols = shuffle(atomicSymbols);

		for(const element of shuffledAtomicSymbols) {
			if(origin.substring(i, i + element.length).toLowerCase() === element.toLowerCase()) {
				result.push({
					element,
					name: atomicData[element].name,
				});

				i += element.length;

				ok = true;
				break;
			}
		}

		if(!ok) {
			result.push({
				invalid: origin[i]
			});

			i++;

		} else {
			ok = false;
		}
	}


	return result;
}

function textToAtomic(origin, tries) {
	let bestResult = [];
	let bestCount = Math.min(); // Will return infinite

	for(let i = 0; i < tries; i++) {
		const result = shuffledTextToAtomic(origin);

		const invalidCount = result.filter((element) => typeof element.invalid !== 'undefined').length;

		if(invalidCount === 0) {
			return result;
		}

		if(invalidCount < bestCount) {
			bestResult = result;
			bestCount = invalidCount;
		}
	}

	return bestResult;
}


// Do work
const words = ['Cafe', 'Test', 'NaN', 'Complex', 'Word', 'Foo', 'Another', 'Atom', 'Text'];
const tries = 1000;

for(const word of words) {
	const res = textToAtomic(word, tries);
	console.log(
		word, ' => ',
		res.map((elt) => elt.element ? '[' + elt.element + '] ' : elt.invalid + ' ').join('')
	);
	console.log('\t ', res.map((elt) => elt.element ? '[' + elt.name + '] ' : elt.invalid + ' ').join(''))
}