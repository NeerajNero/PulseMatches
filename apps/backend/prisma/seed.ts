import {
  CatalogStatus,
  GenderType,
  OrganizerProfile,
  ParticipantType,
  PrismaClient,
  RoleType,
  TournamentFormatType,
  TournamentMediaType,
  TournamentStatus,
  TournamentVisibility
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const seedUsers = [
  {
    email: "admin@matchflow.local",
    password: "AdminPass123!",
    displayName: "Local Admin",
    role: RoleType.ADMIN
  },
  {
    email: "player@matchflow.local",
    password: "PlayerPass123!",
    displayName: "Sample Player",
    role: RoleType.PLAYER
  },
  {
    email: "organizer@matchflow.local",
    password: "OrganizerPass123!",
    displayName: "Sample Organizer",
    role: RoleType.ORGANIZER,
    organizerProfile: {
      organizationName: "Sample Organizer Club",
      slug: "sample-organizer-club",
      contactEmail: "organizer@matchflow.local"
    }
  }
];

const sports = [
  "Badminton",
  "Cricket",
  "Football",
  "Swimming",
  "Tennis"
];

const cities = [
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Mumbai",
  "Delhi"
];

const venues = [
  { name: "Indiranagar Indoor Arena", city: "Bengaluru", address: "12 Court Road, Indiranagar, Bengaluru" },
  { name: "Gachibowli Sports Complex", city: "Hyderabad", address: "Stadium Lane, Gachibowli, Hyderabad" },
  { name: "Marina Aquatic Centre", city: "Chennai", address: "Beach Road, Triplicane, Chennai" },
  { name: "Andheri Turf Park", city: "Mumbai", address: "Sports Link Road, Andheri West, Mumbai" },
  { name: "Dwarka Community Courts", city: "Delhi", address: "Sector 10, Dwarka, Delhi" }
];

interface TournamentCategorySeed {
  name: string;
  code: string;
  formatType?: TournamentFormatType;
  participantType: ParticipantType;
  genderType: GenderType;
  minAge?: number;
  maxAge?: number;
  capacity?: number;
  entryFeeAmount: number;
}

interface TournamentSeed {
  title: string;
  slug: string;
  sport: string;
  city: string;
  venue: string;
  shortDescription: string;
  description: string;
  status: TournamentStatus;
  visibility: TournamentVisibility;
  startsAt: Date;
  endsAt: Date;
  registrationOpensAt: Date;
  registrationClosesAt: Date;
  categories: TournamentCategorySeed[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setUTCHours(4, 30, 0, 0);
  return date;
}

async function main() {
  let organizerProfile: OrganizerProfile | null = null;

  for (const seedUser of seedUsers) {
    const passwordHash = await bcrypt.hash(seedUser.password, 12);
    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      create: {
        email: seedUser.email,
        passwordHash,
        displayName: seedUser.displayName,
        roles: {
          create: { role: seedUser.role }
        },
        organizerProfile: seedUser.organizerProfile
          ? {
              create: {
                organizationName: seedUser.organizerProfile.organizationName,
                slug: seedUser.organizerProfile.slug,
                contactEmail: seedUser.organizerProfile.contactEmail
              }
            }
          : undefined
      },
      update: {
        displayName: seedUser.displayName
      }
    });

    await prisma.userRole.upsert({
      where: {
        userId_role: {
          userId: user.id,
          role: seedUser.role
        }
      },
      create: {
        userId: user.id,
        role: seedUser.role
      },
      update: {}
    });

    if (seedUser.organizerProfile) {
      organizerProfile = await prisma.organizerProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          organizationName: seedUser.organizerProfile.organizationName,
          slug: seedUser.organizerProfile.slug,
          contactEmail: seedUser.organizerProfile.contactEmail
        },
        update: {
          organizationName: seedUser.organizerProfile.organizationName,
          contactEmail: seedUser.organizerProfile.contactEmail
        }
      });
    }
  }

  for (const sportName of sports) {
    await prisma.sport.upsert({
      where: { slug: slugify(sportName) },
      create: {
        name: sportName,
        slug: slugify(sportName),
        status: CatalogStatus.ACTIVE
      },
      update: {
        name: sportName,
        status: CatalogStatus.ACTIVE
      }
    });
  }

  for (const cityName of cities) {
    await prisma.city.upsert({
      where: { slug: slugify(cityName) },
      create: {
        name: cityName,
        slug: slugify(cityName),
        countryCode: "IN",
        status: CatalogStatus.ACTIVE
      },
      update: {
        name: cityName,
        status: CatalogStatus.ACTIVE
      }
    });
  }

  for (const venue of venues) {
    const city = await prisma.city.findUniqueOrThrow({ where: { slug: slugify(venue.city) } });
    await prisma.venue.upsert({
      where: { slug: slugify(venue.name) },
      create: {
        cityId: city.id,
        name: venue.name,
        slug: slugify(venue.name),
        address: venue.address,
        status: CatalogStatus.ACTIVE
      },
      update: {
        cityId: city.id,
        name: venue.name,
        address: venue.address,
        status: CatalogStatus.ACTIVE
      }
    });
  }

  if (!organizerProfile) {
    organizerProfile = await prisma.organizerProfile.findUniqueOrThrow({
      where: { slug: "sample-organizer-club" }
    });
  }

  const tournamentSeeds: TournamentSeed[] = [
    {
      title: "Bengaluru Shuttle Open",
      slug: "bengaluru-shuttle-open",
      sport: "Badminton",
      city: "Bengaluru",
      venue: "Indiranagar Indoor Arena",
      shortDescription: "A weekend badminton tournament for local singles and doubles players.",
      description: "An original MatchFlow Arena sample event with age-group and open categories.",
      status: TournamentStatus.PUBLISHED,
      visibility: TournamentVisibility.PUBLIC,
      startsAt: addDays(12),
      endsAt: addDays(13),
      registrationOpensAt: addDays(-10),
      registrationClosesAt: addDays(8),
      categories: [
        { name: "Open Singles", code: "open-singles", participantType: ParticipantType.SINGLES, genderType: GenderType.OPEN, capacity: 64, entryFeeAmount: 800 },
        { name: "Mixed Doubles", code: "mixed-doubles", participantType: ParticipantType.DOUBLES, genderType: GenderType.MIXED, capacity: 32, entryFeeAmount: 1200 }
      ]
    },
    {
      title: "Hyderabad Corporate Cricket Cup",
      slug: "hyderabad-corporate-cricket-cup",
      sport: "Cricket",
      city: "Hyderabad",
      venue: "Gachibowli Sports Complex",
      shortDescription: "A short-format cricket event for workplace teams.",
      description: "Teams compete through group games before a final. Scoring is planned for a later slice.",
      status: TournamentStatus.PUBLISHED,
      visibility: TournamentVisibility.PUBLIC,
      startsAt: addDays(20),
      endsAt: addDays(22),
      registrationOpensAt: addDays(-5),
      registrationClosesAt: addDays(15),
      categories: [
        { name: "Corporate Teams", code: "corporate-teams", participantType: ParticipantType.TEAM, genderType: GenderType.OPEN, capacity: 16, entryFeeAmount: 5000 }
      ]
    },
    {
      title: "Chennai Junior Swim Meet",
      slug: "chennai-junior-swim-meet",
      sport: "Swimming",
      city: "Chennai",
      venue: "Marina Aquatic Centre",
      shortDescription: "Junior swimming meet with age-band categories.",
      description: "Heat and timing support is planned for a later scoring slice.",
      status: TournamentStatus.PUBLISHED,
      visibility: TournamentVisibility.PUBLIC,
      startsAt: addDays(6),
      endsAt: addDays(6),
      registrationOpensAt: addDays(-15),
      registrationClosesAt: addDays(2),
      categories: [
        { name: "Under 12 Freestyle", code: "u12-freestyle", participantType: ParticipantType.SINGLES, genderType: GenderType.OPEN, minAge: 8, maxAge: 12, capacity: 48, entryFeeAmount: 400 },
        { name: "Under 16 Freestyle", code: "u16-freestyle", participantType: ParticipantType.SINGLES, genderType: GenderType.OPEN, minAge: 13, maxAge: 16, capacity: 48, entryFeeAmount: 400 }
      ]
    },
    {
      title: "Mumbai Turf Football Sevens",
      slug: "mumbai-turf-football-sevens",
      sport: "Football",
      city: "Mumbai",
      venue: "Andheri Turf Park",
      shortDescription: "Seven-a-side football tournament for amateur teams.",
      description: "A public sample event used to verify discovery filters.",
      status: TournamentStatus.PUBLISHED,
      visibility: TournamentVisibility.PUBLIC,
      startsAt: addDays(28),
      endsAt: addDays(29),
      registrationOpensAt: addDays(1),
      registrationClosesAt: addDays(21),
      categories: [
        { name: "Open Teams", code: "open-teams", participantType: ParticipantType.TEAM, genderType: GenderType.OPEN, capacity: 24, entryFeeAmount: 3500 }
      ]
    },
    {
      title: "Delhi Tennis Ladder Weekend",
      slug: "delhi-tennis-ladder-weekend",
      sport: "Tennis",
      city: "Delhi",
      venue: "Dwarka Community Courts",
      shortDescription: "Friendly tennis ladder weekend.",
      description: "Designed as public discovery seed data, not a registration flow.",
      status: TournamentStatus.PUBLISHED,
      visibility: TournamentVisibility.PUBLIC,
      startsAt: addDays(-2),
      endsAt: addDays(-1),
      registrationOpensAt: addDays(-30),
      registrationClosesAt: addDays(-4),
      categories: [
        { name: "Friendly Singles", code: "friendly-singles", participantType: ParticipantType.SINGLES, genderType: GenderType.OPEN, capacity: 32, entryFeeAmount: 600, formatType: TournamentFormatType.FRIENDLY }
      ]
    },
    {
      title: "Hidden Draft Badminton Event",
      slug: "hidden-draft-badminton-event",
      sport: "Badminton",
      city: "Bengaluru",
      venue: "Indiranagar Indoor Arena",
      shortDescription: "This draft event must not appear publicly.",
      description: "Smoke-test record for public visibility rules.",
      status: TournamentStatus.DRAFT,
      visibility: TournamentVisibility.PUBLIC,
      startsAt: addDays(40),
      endsAt: addDays(41),
      registrationOpensAt: addDays(5),
      registrationClosesAt: addDays(30),
      categories: [
        { name: "Draft Singles", code: "draft-singles", participantType: ParticipantType.SINGLES, genderType: GenderType.OPEN, capacity: 16, entryFeeAmount: 500 }
      ]
    },
    {
      title: "Archived Cricket Trial",
      slug: "archived-cricket-trial",
      sport: "Cricket",
      city: "Hyderabad",
      venue: "Gachibowli Sports Complex",
      shortDescription: "This archived event must not appear publicly.",
      description: "Smoke-test record for public visibility rules.",
      status: TournamentStatus.ARCHIVED,
      visibility: TournamentVisibility.PUBLIC,
      startsAt: addDays(45),
      endsAt: addDays(46),
      registrationOpensAt: addDays(5),
      registrationClosesAt: addDays(30),
      categories: [
        { name: "Archived Teams", code: "archived-teams", participantType: ParticipantType.TEAM, genderType: GenderType.OPEN, capacity: 8, entryFeeAmount: 3000 }
      ]
    },
    {
      title: "Blocked Football Test",
      slug: "blocked-football-test",
      sport: "Football",
      city: "Mumbai",
      venue: "Andheri Turf Park",
      shortDescription: "This blocked event must not appear publicly.",
      description: "Smoke-test record for public visibility rules.",
      status: TournamentStatus.BLOCKED,
      visibility: TournamentVisibility.PUBLIC,
      startsAt: addDays(50),
      endsAt: addDays(51),
      registrationOpensAt: addDays(5),
      registrationClosesAt: addDays(30),
      categories: [
        { name: "Blocked Teams", code: "blocked-teams", participantType: ParticipantType.TEAM, genderType: GenderType.OPEN, capacity: 8, entryFeeAmount: 3000 }
      ]
    }
  ];

  for (const tournamentSeed of tournamentSeeds) {
    const sport = await prisma.sport.findUniqueOrThrow({ where: { slug: slugify(tournamentSeed.sport) } });
    const city = await prisma.city.findUniqueOrThrow({ where: { slug: slugify(tournamentSeed.city) } });
    const venue = await prisma.venue.findUniqueOrThrow({ where: { slug: slugify(tournamentSeed.venue) } });

    const tournament = await prisma.tournament.upsert({
      where: { slug: tournamentSeed.slug },
      create: {
        organizerProfileId: organizerProfile.id,
        sportId: sport.id,
        cityId: city.id,
        venueId: venue.id,
        title: tournamentSeed.title,
        slug: tournamentSeed.slug,
        shortDescription: tournamentSeed.shortDescription,
        description: tournamentSeed.description,
        status: tournamentSeed.status,
        visibility: tournamentSeed.visibility,
        startsAt: tournamentSeed.startsAt,
        endsAt: tournamentSeed.endsAt,
        registrationOpensAt: tournamentSeed.registrationOpensAt,
        registrationClosesAt: tournamentSeed.registrationClosesAt,
        maxParticipants: tournamentSeed.categories.reduce((sum, category) => sum + (category.capacity ?? 0), 0),
        publishedAt: tournamentSeed.status === TournamentStatus.PUBLISHED ? addDays(-2) : null
      },
      update: {
        sportId: sport.id,
        cityId: city.id,
        venueId: venue.id,
        title: tournamentSeed.title,
        shortDescription: tournamentSeed.shortDescription,
        description: tournamentSeed.description,
        status: tournamentSeed.status,
        visibility: tournamentSeed.visibility,
        startsAt: tournamentSeed.startsAt,
        endsAt: tournamentSeed.endsAt,
        registrationOpensAt: tournamentSeed.registrationOpensAt,
        registrationClosesAt: tournamentSeed.registrationClosesAt,
        maxParticipants: tournamentSeed.categories.reduce((sum, category) => sum + (category.capacity ?? 0), 0),
        publishedAt: tournamentSeed.status === TournamentStatus.PUBLISHED ? addDays(-2) : null
      }
    });

    for (const categorySeed of tournamentSeed.categories) {
      await prisma.tournamentCategory.upsert({
        where: {
          tournamentId_code: {
            tournamentId: tournament.id,
            code: categorySeed.code
          }
        },
        create: {
          tournamentId: tournament.id,
          name: categorySeed.name,
          code: categorySeed.code,
          formatType: categorySeed.formatType ?? TournamentFormatType.KNOCKOUT,
          participantType: categorySeed.participantType,
          genderType: categorySeed.genderType,
          minAge: categorySeed.minAge,
          maxAge: categorySeed.maxAge,
          entryFeeAmount: categorySeed.entryFeeAmount,
          entryFeeCurrency: "INR",
          capacity: categorySeed.capacity
        },
        update: {
          name: categorySeed.name,
          formatType: categorySeed.formatType ?? TournamentFormatType.KNOCKOUT,
          participantType: categorySeed.participantType,
          genderType: categorySeed.genderType,
          minAge: categorySeed.minAge,
          maxAge: categorySeed.maxAge,
          entryFeeAmount: categorySeed.entryFeeAmount,
          capacity: categorySeed.capacity
        }
      });
    }

    await prisma.tournamentMedia.upsert({
      where: { id: `${tournament.id}` },
      create: {
        id: tournament.id,
        tournamentId: tournament.id,
        type: TournamentMediaType.IMAGE,
        url: `https://picsum.photos/seed/${tournamentSeed.slug}/1200/720`,
        altText: `${tournamentSeed.title} event image`,
        sortOrder: 1
      },
      update: {
        url: `https://picsum.photos/seed/${tournamentSeed.slug}/1200/720`,
        altText: `${tournamentSeed.title} event image`,
        sortOrder: 1
      }
    });
  }

  console.log(`Seeded ${seedUsers.length} local users, ${sports.length} sports, ${cities.length} cities, ${venues.length} venues, and ${tournamentSeeds.length} tournaments.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
