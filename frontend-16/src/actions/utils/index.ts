import { db } from '@/db';

async function checkSlugUniqueness(slug: string) {
	console.log('searching for slug: ' + slug);
	const exists =
		null ===
		(await db.barrel.findUnique({
			where: {
				slug: slug,
			},
		}));
	console.log('slug is unique: ' + exists);
	return exists; // Returns true if unique, false if exists
}

export async function createSlug(name: string) {
	let slug = name.replace(/\s+/g, '-').replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o').toLowerCase();

	let slugId = 0;
	while (!(await checkSlugUniqueness(slug))) {
		console.log('not unique slug');
		slug += slugId.toString();
		slugId++;
		console.log('new slug: ' + slug);
	}

	return slug;
}

export const createBarrelTemplate = (slug: string, userId: string) => {
	return {
		slug: slug,
		userId: userId,
	};
};

export const createBarrelDetails = (name: string, notes: string, barrelId: string) => {
	return {
		// id
		name: name,
		notes: notes,
		height: 200,
		bottomDiameter: 180,
		topDiameter: 418,
		staveLength: 232.73,
		angle: 30.75,
		staveBottomThickness: 12,
		staveTopThickness: 4,
		bottomThickness: 8,
		bottomMargin: 2,
		// createdAt : "", //((new Date()).getTime()),
		// updatedAt: "", //((new Date()).getTime()),
		barrelId: barrelId,
		isPublic: true,
		isExample: false,
	};
};

export function createStaveCurveConfig(barrelId: string, paperType: string = 'A4') {
	return {
		defaultPaperType: paperType,
		barrelId: barrelId,
	};
}

export function createStaveCurveConfigDetails(paperType: string, staveCurveConfigId: string) {
	return {
		paperType: paperType, // A4 or A3
		rotatePaper: false,
		posX: 30,
		posY: 20,
		innerTopX: 20.5,
		innerTopY: 220,
		outerTopX: 20.5,
		outerTopY: 180,
		innerBottomX: 20.5,
		innerBottomY: 90,
		outerBottomX: 20.5,
		outerBottomY: 50,
		rectX: 0,
		rectY: 0,
		rectWidth: 20,
		rectHeight: 250,
		staveCurveConfigId: staveCurveConfigId,
	};
}

export function createStaveFrontConfig(barrelId: string, paperType: string = 'A4') {
	return {
		defaultPaperType: paperType,
		barrelId: barrelId,
	};
}

export function createStaveFrontConfigDetails(paperType: string, staveFrontConfigId: string) {
	return {
		paperType: paperType, // A4 or A3
		rotatePaper: false,
		posX: 0,
		posY: 200,
		spacing: 14, // mm mellan varje stavstorlek
		staveFrontConfigId: staveFrontConfigId,
	};
}

export function createStaveEndConfig(barrelId: string, paperType: string = 'A4') {
	return {
		//  id:"",
		defaultPaperType: paperType,
		barrelId: barrelId,
	};
}

export function createStaveEndConfigDetails(paperType: string, staveEndConfigId: string) {
	return {
		paperType: paperType, // A4 or A3
		rotatePaper: false,
		topEndY: -100,
		bottomEndY: -50,
		staveEndConfigId: staveEndConfigId,
	};
}
