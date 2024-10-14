'use server';
import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteBarrel(id: string) {
	console.log('Nu deletar vi!!');
	await db.barrel.delete({
		where: { id },
	});

	revalidatePath('/');
	//redirect('/');
}
// revalidate homepage(with the library) after deleting a barrel
