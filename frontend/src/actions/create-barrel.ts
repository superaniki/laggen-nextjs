'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import paths from '@/paths';
import { redirect } from 'next/navigation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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

/*
Todo : increasing ID on barrels instead of long complex name. yes?
*/

const createBarrelSchema = z.object({
	name: z
		.string()
		.min(3)
		.regex(/^[a-zA-Z0-9ÅÄÖåäö ]+$/, {
			message: 'Please avoid special characters',
		}),
	notes: z.string(),
});

interface CreateBarrelFormState {
	errors: {
		name?: string[];
		notes?: string[];
		_form?: string[]; // extra variable,
		// to do other checks, like loginmessage, db error etc etc
	};
	success: boolean;
}

export async function createBarrel(
	formState: CreateBarrelFormState,
	formData: FormData
): Promise<CreateBarrelFormState> {
	//await new Promise(resolve => setTimeout(resolve, 2500));

	console.log('init formstate:' + JSON.stringify(formState));
	//formState = { success : false, errors :{}}

	const result = createBarrelSchema.safeParse({
		name: formData.get('name'),
		notes: formData.get('notes'),
	});

	if (!result.success) {
		return { ...formState, errors: result.error.flatten().fieldErrors }; // errors för name och notes
	}

	const name = result.data.name;
	const notes = result.data.notes;

	const session = await auth();
	if (!session || !session.user?.id) {
		return {
			...formState,
			errors: {
				_form: ['You must be signed in to do this.'],
			},
		};
	}

	const slug = await createSlug(name);

	try {
		const barrelTemplate = createBarrelTemplate(slug, session.user.id);
		const barrel = await db.barrel.create({
			data: { ...barrelTemplate },
		});

		let barrelDetailsTemplate = createBarrelDetails(name, notes, barrel.id);
		const barrelDetails = await db.barrelDetails.create({
			data: { ...barrelDetailsTemplate },
		});

		let staveCurveConfigTemplate = createStaveCurveConfig(barrel.id);
		const newSCconfig = await db.staveCurveConfig.create({
			data: { ...staveCurveConfigTemplate },
		});

		await db.staveCurveConfigDetails.create({
			data: { ...createStaveCurveConfigDetails('A4', newSCconfig.id) },
		});

		await db.staveCurveConfigDetails.create({
			data: { ...createStaveCurveConfigDetails('A3', newSCconfig.id) },
		});

		let staveFrontConfigTemplate = createStaveFrontConfig(barrel.id);
		const newSFconfig = await db.staveFrontConfig.create({
			data: { ...staveFrontConfigTemplate },
		});

		await db.staveFrontConfigDetails.create({
			data: { ...createStaveFrontConfigDetails('A4', newSFconfig.id) },
		});

		await db.staveFrontConfigDetails.create({
			data: { ...createStaveFrontConfigDetails('A3', newSFconfig.id) },
		});

		let staveEndConfigTemplate = createStaveEndConfig(barrel.id);
		const newSEconfig = await db.staveEndConfig.create({
			data: { ...staveEndConfigTemplate },
		});

		await db.staveEndConfigDetails.create({
			data: { ...createStaveEndConfigDetails('A4', newSEconfig.id) },
		});

		await db.staveEndConfigDetails.create({
			data: { ...createStaveEndConfigDetails('A3', newSEconfig.id) },
		});
	} catch (err: unknown) {
		if (err instanceof PrismaClientKnownRequestError) {
			console.log(JSON.stringify(err));
			if (err.code === 'P2002') {
				//"Unique constraint failed on the {constraint}"
				console.log('code p2002');
				return {
					...formState,
					errors: {
						_form: ['Name already in use. Please choose a different one'],
					},
				};
			}
			console.log('NOT code p2002');

			return {
				...formState,
				errors: {
					_form: [err.message],
				},
			};
		} else if (err instanceof PrismaClientKnownRequestError) {
			console.log('PrismaClientKnownRequestError!');

			console.log(JSON.stringify(err));
		} else {
			console.log('NOT PrismaClientKnownRequestError');
			console.log(JSON.stringify(err));
			return {
				...formState,
				errors: {
					_form: ['Something went wrong'],
				},
			};
		}
	}

	formState = { errors: {}, success: true };

	revalidatePath('/');
	//redirect("/");
	return formState;
}
