import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { App } from '../src/pages/app.page';
import { UserBuilder, ArticleBuilder } from '../src/pages/helpers/builders/index';

async function registerUser(page, user, app) {
    await app.mainPage.open(url);
    await app.mainPage.gotoRegister();
    await app.registerPage.register(user.name, user.email, user.password);
}

const url = 'https://realworld.qa.guru/';

test('User can change his name', async ({ page }) => {
    const user = new UserBuilder().withEmail().withName().withPassword().build();
    const newUserName = faker.person.fullName(); 
    
    const app = new App(page);

    await registerUser(page, user, app);

    await app.homePage.gotoSettings();
    await app.settingsPage.changeName(newUserName);
    await expect(app.settingsPage.getProfileNameLocator()).toContainText(newUserName);
});

test('User can change his password', async ({ page }) => {
    const user = new UserBuilder().withEmail().withName().withPassword().build();
    const newPassword = faker.internet.password({ length: 10 });

    const app = new App(page);

    await registerUser(page, user, app);

    await app.homePage.gotoSettings();
    await app.settingsPage.changePassword(newPassword);
    await app.homePage.logOut();

    await app.mainPage.gotoLogin();
    await app.loginPage.login(user.email, newPassword);

    await expect(app.homePage.getProfileNameLocator()).toContainText(user.name);
});

test('User can create new article', async ({ page }) => {
    const app = new App(page);
    const user = new UserBuilder().withEmail().withName().withPassword().build();
    const article = new ArticleBuilder().withTag().build();

    await registerUser(page, user, app);
    await app.homePage.gotoNewArticle();
    await app.newArticlePage.createNewArticle(article.title, article.topic, article.content, article.tag);

    expect(await app.viewArticlePage.getArticleContent()).toContain(article.content);
});

test('User can create new comment on the article', async ({ page }) => {
    const app = new App(page);

    const user = new UserBuilder().withEmail().withName().withPassword().build(); 
    const article = new ArticleBuilder().withTag().build();
    const commentText = faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 20);

    await registerUser(page, user, app);
    await app.homePage.gotoNewArticle();
    await app.newArticlePage.createNewArticle(article.title, article.topic, article.content, article.tag);
    await app.viewArticlePage.createNewComment(commentText);

    expect(await app.viewArticlePage.getCommentContent()).toContain(commentText);
});

test('User can edit his article', async ({ page }) => {
    const app = new App(page);

    const user = new UserBuilder().withEmail().withName().withPassword().build();
    const article = new ArticleBuilder().withTag().build();
    const newArticle = new ArticleBuilder().withTag().build();

    await registerUser(page, user, app);
    await app.homePage.gotoNewArticle();
    await app.newArticlePage.createNewArticle(article.title, article.topic, article.content, article.tag);
    await app.viewArticlePage.gotoEditArticle();
    await app.editArticlePage.updateArticle(newArticle.title, newArticle.topic, newArticle.content, newArticle.tag);

    expect(await app.viewArticlePage.getArticleContent()).toContain(newArticle.content);
});
