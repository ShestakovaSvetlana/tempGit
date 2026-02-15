import {test as base} from '@playwright/test';
import { App } from '../../pages/app.page';
import { UserBuilder, ArticleBuilder } from '../builders/index';

export const test = base.extend({
    app: async ({ page }, use) => {
        const app = new App(page);
        await use(app);
    },

    testUser: async ({}, use) => {
        const user = new UserBuilder().withEmail().withName().withPassword().build();
        await use(user);
    },

    authenticatedUser: async ({ app }, use) => {
        const user = new UserBuilder().withEmail().withName().withPassword().build();
        const url = 'https://realworld.qa.guru/';      
        await app.mainPage.open(url);
        await app.mainPage.gotoRegister();
        await app.registerPage.register(user.name, user.email, user.password);
        await use({ user, app });
    },

    articleWithUser: async ({ authenticatedUser }, use) => {
        const { user, app } = authenticatedUser;
        const article = new ArticleBuilder().withTag().build();
        
        await app.homePage.gotoNewArticle();
        await app.newArticlePage.createNewArticle(
            article.title, 
            article.topic, 
            article.content, 
            article.tag
        );
        
        await use({ user, article, app });
    }
});