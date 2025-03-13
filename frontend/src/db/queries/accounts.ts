import { db } from '..';
import type { Account } from '@prisma/client';

export async function fetchAllAccounts(): Promise<Account[]> {
	return db.account.findMany({});
}
