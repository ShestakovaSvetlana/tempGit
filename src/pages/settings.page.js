export class SettingsPage {
    constructor (page) {
        this.page = page;
        this.updateSettingsButton = page.getByRole('button', { name: 'Update Settings' });
        this.nameInput = page.getByRole('textbox', { name: 'Your Name' });
        this.passwordInput =  page.getByRole('textbox', { name: 'Password' })
        this.profileName = page.locator('.dropdown-toggle');
    }
    
    async changeName(name) {  
        await this.nameInput.click();
        await this.nameInput.fill(name);

        await this.updateSettingsButton.click();  
    }

    getProfileNameLocator() {
        return this.profileName;
    }

    async changePassword(password) {  
        await this.passwordInput.click();
        await this.passwordInput.fill(password);

        await this.updateSettingsButton.click();  
    }

}