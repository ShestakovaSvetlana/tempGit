import { expect } from '@playwright/test';
import { test } from '../src/helpers/fixtures/fixture';
import { faker } from '@faker-js/faker';
import { UserBuilder, ArticleBuilder } from '../src/helpers/builders/index';

test.describe('User Profile Management', () => {
    test('should allow user to change profile name', async ({ authenticatedUser }) => {
        const { app } = authenticatedUser;
        const newUserName = faker.person.fullName(); 

        await app.homePage.gotoSettings();
        await app.settingsPage.changeName(newUserName);
        await expect(app.settingsPage.getProfileNameLocator()).toContainText(newUserName);
    });

    test('User can change his password', async ({ authenticatedUser }) => {
        const { user, app } = authenticatedUser;
        const newPassword = faker.internet.password({ length: 10 });

        await app.homePage.gotoSettings();
        await app.settingsPage.changePassword(newPassword);
        await app.homePage.logOut();

        await app.mainPage.gotoLogin();
        await app.loginPage.login(user.email, newPassword);

        await expect(app.homePage.getProfileNameLocator()).toContainText(user.name);
    });
});

test.describe('Article Management', () => {
    test('User can create new article', async ({ authenticatedUser }) => {
        const { app } = authenticatedUser;
        const article = new ArticleBuilder().withTag().build();

        await app.homePage.gotoNewArticle();
        await app.newArticlePage.createNewArticle(article.title, article.topic, article.content, article.tag);

        expect(await app.viewArticlePage.getArticleContent()).toContain(article.content);
    });

    test('User can create new comment on the article', async ({ articleWithUser }) => {
        const { app } = articleWithUser;
        const commentText = faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 20);

        await app.viewArticlePage.createNewComment(commentText);

        expect(await app.viewArticlePage.getCommentContent()).toContain(commentText);
    });

    test('User can edit his article', async ({ articleWithUser }) => {
        const { app } = articleWithUser;
        const newArticle = new ArticleBuilder().withTag().build();

        await app.viewArticlePage.gotoEditArticle();
        await app.editArticlePage.updateArticle(newArticle.title, newArticle.topic, newArticle.content, newArticle.tag);

        expect(await app.viewArticlePage.getArticleContent()).toContain(newArticle.content);
    });
});
