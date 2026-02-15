import {MainPage, RegisterPage, HomePage, LoginPage, SettingsPage, NewArticlePage, ViewArticlePage, EditArticlePage} from './index';

export class App {
    constructor(page) {
        this.page = page;
        this.mainPage = new MainPage(page);
        this.homePage = new HomePage(page);
        this.loginPage = new LoginPage(page);
        this.settingsPage = new SettingsPage(page);
        this.registerPage = new RegisterPage(page);
        this.newArticlePage = new NewArticlePage(page);
        this.viewArticlePage = new ViewArticlePage(page);
        this.editArticlePage = new EditArticlePage(page);
    }
}