import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {MainPage} from '../src/pages/main.page.js';
import {RegisterPage} from '../src/pages/register.page.js'; 
import {HomePage} from '../src/pages/home.page.js'; 
import { LoginPage } from '../src/pages/login.page.js';
import { SettingsPage } from '../src/pages/settings.page.js';  
import { NewArticlePage } from '../src/pages/newArticle.page.js'; 
import { ViewArticlePage } from '../src/pages/viewArticle.page.js';
import { EditArticlePage } from '../src/pages/editArticle.page.js';


async function registerUser(page, user) {
    const mainPage = new MainPage(page);    
    const registerPage = new RegisterPage(page);
    await mainPage.open(url);
    await mainPage.gotoRegister();
    await registerPage.register(user.name, user.email, user.password);
}

async function generateNewUser() {
    const user = {
        email: faker.internet.email({provider: 'qa.guru' }),
        name: faker.person.fullName(),
        password: faker.internet.password({ length: 10 }),
    }
    return user;
}

const url = 'https://realworld.qa.guru/';


test('User can change his name', async ({ page }) => {
    const user = await generateNewUser();  
    const newUserName = faker.person.fullName(); 
    
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);

    await registerUser(page, user);

    await homePage.gotoSettings();
    await settingsPage.changeName(newUserName);
    await expect(settingsPage.getProfileNameLocator()).toContainText(newUserName);
});

test('User can change his password', async ({ page }) => {
    const user = await generateNewUser(); 
    const newPassword = faker.internet.password({ length: 10 });

    const mainPage = new MainPage(page);    
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const settingsPage = new SettingsPage(page);

    await registerUser(page, user);

    await homePage.gotoSettings();
    await settingsPage.changePassword(newPassword);
    await homePage.logOut();

    await mainPage.gotoLogin();
    await loginPage.login(user.email, newPassword);

    await expect(homePage.getProfileNameLocator()).toContainText(user.name);
});

test('User can create new article', async ({ page }) => {
    const newArticlePage = new NewArticlePage(page);
    const homePage = new HomePage(page);
    const viewArticlePage = new ViewArticlePage(page);
    const user = await generateNewUser(); 
    const article = {
        title: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 10),
        topic: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 8),
        content: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 20),
        tag: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 5),
    }

    await registerUser(page, user);
    await homePage.gotoNewArticle();
    await newArticlePage.createNewArticle(article.title, article.topic, article.content, article.tag);

    expect(await viewArticlePage.getArticleContent()).toContain(article.content);
});

test('User can create new comment on the article', async ({ page }) => {
    const newArticlePage = new NewArticlePage(page);
    const homePage = new HomePage(page);
    const viewArticlePage = new ViewArticlePage(page);

    const user = await generateNewUser(); 
    const article = {
        title: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 10),
        topic: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 8),
        content: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 20),
        tag: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 5),
    }
    const commentText = faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 20);

    await registerUser(page, user);
    await homePage.gotoNewArticle();
    await newArticlePage.createNewArticle(article.title, article.topic, article.content, article.tag);
    await viewArticlePage.createNewComment(commentText);

    expect(await viewArticlePage.getCommentContent()).toContain(commentText);
});

test('User can edit his article', async ({ page }) => {
    const newArticlePage = new NewArticlePage(page);
    const homePage = new HomePage(page);
    const viewArticlePage = new ViewArticlePage(page);
    const editArticlePage = new EditArticlePage(page);

    const user = await generateNewUser(); 
    const article = {
        title: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 10),
        topic: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 8),
        content: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 20),
        tag: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 5),
    }
    const newArticle = {
        title: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 10),
        topic: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 8),
        content: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 20),
        tag: faker.string.fromCharacters('abcdefghijklmnopqrstuvwxyz', 5),
    }


    await registerUser(page, user);
    await homePage.gotoNewArticle();
    await newArticlePage.createNewArticle(article.title, article.topic, article.content, article.tag);
    await viewArticlePage.gotoEditArticle();
    await editArticlePage.updateArticle(newArticle.title, newArticle.topic, newArticle.content, newArticle.tag);


    expect(await viewArticlePage.getArticleContent()).toContain(newArticle.content);
});
