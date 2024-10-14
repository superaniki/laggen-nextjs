'use server';

import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import {
	createBarrelDetails,
	createBarrelTemplate,
	createSlug,
	createStaveCurveConfig,
	createStaveCurveConfigDetails,
	createStaveEndConfig,
	createStaveEndConfigDetails,
	createStaveFrontConfig,
	createStaveFrontConfigDetails,
} from './utils';
import { fetchOneBarrelById } from '@/db/queries/barrels';

export async function duplicateBarrel(id: string) {
	const originalBarrel = await fetchOneBarrelById(id);
	if (!originalBarrel) {
		throw new Error('Barrel not found');
	}

	const newSlug = await createSlug(originalBarrel.barrelDetails.name + ' (copy)');

	const barrelTemplate = createBarrelTemplate(newSlug, originalBarrel.userId);
	const barrel = await db.barrel.create({
		data: { ...barrelTemplate },
	});

	{
		const { id, ...barrelDetailsWithoutId } = originalBarrel.barrelDetails;
		const barrelDetails = await db.barrelDetails.create({
			data: { ...barrelDetailsWithoutId, barrelId: barrel.id, name: originalBarrel.barrelDetails.name + ' (copy)' },
		});
	}

	let staveCurveConfigTemplate = createStaveCurveConfig(barrel.id, originalBarrel.staveCurveConfig.defaultPaperType);
	const newSCconfig = await db.staveCurveConfig.create({
		data: { ...staveCurveConfigTemplate },
	});

	originalBarrel.staveCurveConfig.configDetails.forEach(async (staveCurveConfigDetails) => {
		const { id, ...staveCurveConfigDetailsWithoutId } = staveCurveConfigDetails;
		const newStaveCurveConfigDetails = await db.staveCurveConfigDetails.create({
			data: { ...staveCurveConfigDetailsWithoutId, staveCurveConfigId: newSCconfig.id },
		});
	});

	let staveFrontConfigTemplate = createStaveFrontConfig(barrel.id, originalBarrel.staveFrontConfig.defaultPaperType);
	const newSFconfig = await db.staveFrontConfig.create({
		data: { ...staveFrontConfigTemplate },
	});

	originalBarrel.staveFrontConfig.configDetails.forEach(async (staveFrontConfigDetails) => {
		const { id, ...staveFrontConfigDetailsWithoutId } = staveFrontConfigDetails;
		const newStaveFrontConfigDetails = await db.staveFrontConfigDetails.create({
			data: { ...staveFrontConfigDetailsWithoutId, staveFrontConfigId: newSFconfig.id },
		});
	});

	let staveEndConfigTemplate = createStaveEndConfig(barrel.id, originalBarrel.staveEndConfig.defaultPaperType);
	const newSEconfig = await db.staveEndConfig.create({
		data: { ...staveEndConfigTemplate },
	});

	originalBarrel.staveEndConfig.configDetails.forEach(async (staveEndConfigDetails) => {
		const { id, ...staveEndConfigDetailsWithoutId } = staveEndConfigDetails;
		const newStaveEndConfigDetails = await db.staveEndConfigDetails.create({
			data: { ...staveEndConfigDetailsWithoutId, staveEndConfigId: newSEconfig.id },
		});
	});

	revalidatePath('/barrels');
}
