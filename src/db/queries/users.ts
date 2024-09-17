import { db } from '..';
import type { User } from '@prisma/client';

export async function fetchAllUsers(): Promise<User[]> {
	return db.user.findMany({
		/*   include: {
      user: { select: { name: true, image: true } },
    },*/
	});
}
