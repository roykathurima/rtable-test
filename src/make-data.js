import { faker } from "@faker-js/faker";
// import { v4 } from "uuid";


const newIndividual = () => ({
    // id: v4(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    title: faker.helpers.shuffle([
      'Mister',
      'Madam',
      'Miss',
    ])[0],
})

export const makeData = (number) => {
    const retVal = [];
    for (let i = 0; i<number; i++) {
        retVal.push(newIndividual());
    }
    return retVal;
}