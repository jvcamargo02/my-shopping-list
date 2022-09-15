import { faker } from "@faker-js/faker"
import { TItemUpdate } from "../src/types/ItemsTypes"

export function item() : TItemUpdate {
    return {
        title: faker.random.word(),
        url: faker.internet.avatar(),
        description: faker.lorem.lines(),
        amount: +(faker.random.numeric(5))
    }
}