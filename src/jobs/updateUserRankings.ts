import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

type UserForRanking = {
  id: string;
  auraPoints: number | null;
  updatedAt: Date;
  countryRank?: number;
  stateRank?: number;
  institutionRank?: number;
};

function sortUsersForRanking(users: UserForRanking[]) {
  return users.sort((a, b) => {
    const aPoints = a.auraPoints ?? -Infinity;
    const bPoints = b.auraPoints ?? -Infinity;
    if (aPoints === bPoints) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    if (aPoints <= 0 && bPoints > 0) return 1;
    if (aPoints > 0 && bPoints <= 0) return -1;
    return bPoints - aPoints;
  });
}

async function updateUserRankings() {
  // COUNTRY RANK
  const countries = await client.user.findMany({
    where: { isActive: true, isDeleted: false },
    distinct: ["country"],
    select: { country: true },
  });

  // Store all user ranks in memory for adjustment
  const userRanks: Record<string, UserForRanking> = {};

  for (const { country } of countries) {
    let users: UserForRanking[] = await client.user.findMany({
      where: { country, isActive: true, isDeleted: false },
      select: { id: true, auraPoints: true, updatedAt: true },
    });
    users = sortUsersForRanking(users);
    for (let i = 0; i < users.length; i++) {
      userRanks[users[i].id] = { ...users[i], countryRank: i + 1 };
    }
  }

  // STATE RANK
  const states = await client.user.findMany({
    where: { isActive: true, isDeleted: false },
    distinct: ["country", "state"],
    select: { country: true, state: true },
  });

  for (const { country, state } of states) {
    let users: UserForRanking[] = await client.user.findMany({
      where: { country, state, isActive: true, isDeleted: false },
      select: { id: true, auraPoints: true, updatedAt: true },
    });
    users = sortUsersForRanking(users);
    for (let i = 0; i < users.length; i++) {
      const user = userRanks[users[i].id] || users[i];
      // Enforce stateRank <= countryRank
      const stateRank = Math.min(i + 1, user.countryRank ?? Infinity);
      userRanks[users[i].id] = { ...user, stateRank };
    }
  }

  // INSTITUTION RANK
  const institutions = await client.user.findMany({
    where: { isActive: true, isDeleted: false },
    distinct: ["country", "state", "institution"],
    select: { country: true, state: true, institution: true },
  });

  for (const { country, state, institution } of institutions) {
    let users: UserForRanking[] = await client.user.findMany({
      where: { country, state, institution, isActive: true, isDeleted: false },
      select: { id: true, auraPoints: true, updatedAt: true },
    });
    users = sortUsersForRanking(users);
    for (let i = 0; i < users.length; i++) {
      const user = userRanks[users[i].id] || users[i];
      // Enforce institutionRank <= stateRank and <= countryRank
      const institutionRank = Math.min(
        i + 1,
        user.stateRank ?? Infinity,
        user.countryRank ?? Infinity
      );
      userRanks[users[i].id] = { ...user, institutionRank };
    }
  }

  // Now update all users in DB
  for (const userId in userRanks) {
    const { countryRank, stateRank, institutionRank } = userRanks[userId];
    await client.user.update({
      where: { id: userId },
      data: {
        countryRank,
        stateRank,
        institutionRank,
      },
    });
  }

  console.log("User rankings updated at", new Date().toISOString());
}

// Schedule the job to run every 1 minutes
cron.schedule("*/1 * * * *", () => {
  updateUserRankings().catch(console.error);
});

// Schedule the job to run every 12 hours (at minute 0, hour 0 and 12)
// cron.schedule("0 */12 * * *", () => {
//   updateUserRankings().catch(console.error);
// });
