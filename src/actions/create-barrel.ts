'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import paths from '@/paths';
import { redirect } from 'next/navigation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createSlug } from './utils';
/*
model Barrel {
  id                   String   @id @default(cuid())
  slug                 String   @unique
  name                 String   @unique
  notes                String
  height               Float
  bottomDiameter       Float
  topDiameter          Float
  staveLength          Float
  angle                Float
  staveBottomThickness Float
  staveTopThickness    Float
  bottomThickness      Float
  bottomMargin         Float
  userId               String
  isPublic             Boolean  @default(true)
  isExample            Boolean  @default(false)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
*/

/*
Todo : increasing ID on barrels instead of long complex name. yes?
*/

const createBarrelTemplate = (slug: string, userId: string) => {
	return {
		slug: slug,
		userId: userId,
	};
};

const createBarrelDetails = (name: string, notes: string, barrelId: string) => {
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

function createStaveCurveConfig(barrelId: string) {
	//: StaveCurveConfig {
	return {
		//  id:"",
		defaultPaperType: 'A4',
		barrelId: barrelId,
	};
}
/// HÄR!!! lägg till editordata tyyyyp

function createStaveCurveConfigDetails(paperType: string, staveCurveConfigId: string) {
	return {
		//   id: "",
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

function createStaveFrontConfig(barrelId: string) {
	return {
		//  id:"",
		defaultPaperType: 'A4',
		barrelId: barrelId,
	};
}

function createStaveFrontConfigDetails(paperType: string, staveFrontConfigId: string) {
	return {
		paperType: paperType, // A4 or A3
		rotatePaper: false,
		posX: 0,
		posY: 200,
		spacing: 14, // mm mellan varje stavstorlek
		staveFrontConfigId: staveFrontConfigId,
	};
}

function createStaveEndConfig(barrelId: string) {
	return {
		//  id:"",
		defaultPaperType: 'A4',
		barrelId: barrelId,
	};
}

function createStaveEndConfigDetails(paperType: string, staveEndConfigId: string) {
	return {
		paperType: paperType, // A4 or A3
		rotatePaper: false,
		topEndY: -100,
		bottomEndY: -50,
		staveEndConfigId: staveEndConfigId,
	};
}

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

	//console.log("revalidatePath");
	revalidatePath('/'); // revalidate!
	//console.log("redirect");
	//redirect("/");
	//console.log("after redirect");

	return formState;
}

/*
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/src/db';

export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({
    where: { id },
  });

  revalidatePath('/');
  redirect('/');
}

export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  try {
    // Check the user's inputs and make sure they're valid
    const title = formData.get('title');
    const code = formData.get('code');

    if (typeof title !== 'string' || title.length < 3) {
      return {
        message: 'Title must be longer',
      };
    }
    if (typeof code !== 'string' || code.length < 10) {
      return {
        message: 'Code must be longer',
      };
    }

    // Create a new record in the database
    await db.snippet.create({
      data: {
        title,
        code,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: err.message,
      };
    } else {
      return {
        message: 'Something went wrong...',
      };
    }
  }

  // Redirect the user back to the root route
  revalidatePath('/');
  redirect('/');
}

*/

// revalidate homepage(with the library) after creating a barrel

/*
"use server";

import type { Barrel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";

const createBarrelSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
      message: "Must be lower letters or dashed without spaces",
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[]; // extra variable,
    // to do other checks, like loginmessage, db error etc etc
  };
}

export async function createBarrel(
  formState: CreateTopicFormState,
  formData: FormData,
): Promise<CreateTopicFormState> {
  //await new Promise(resolve => setTimeout(resolve, 2500))

  const name = formData.get("name");
  const description = formData.get("description");
  const result = createTopicSchema.safeParse({ name, description });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this."],
      },
    };
  }

  let topic: Topic;
  try {
    //throw new Error('Failed to create a topic');
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }
  revalidatePath("/"); // revalidate!
  redirect(paths.topicShow(topic.slug));
}
*/
