#!/usr/bin/env -S tsx scripts/generate-data.ts
import { faker } from "@faker-js/faker";

const persons = [];

for (let i = 0; i < 300; i++) {
  persons.push({
    id: i,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
  });
}
console.log(JSON.stringify(persons));
