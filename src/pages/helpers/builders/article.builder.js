import { faker } from '@faker-js/faker';

export class ArticleBuilder {
    constructor() {
        this.title = faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 10);
        this.topic = faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 8);
        this.content = faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 20);
    }
    
    withTag(tag) {
        this.tag = tag ?? faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 5);
        return this;
    }
    
    build() {
        const result = {...this};
        return result;
    }
}