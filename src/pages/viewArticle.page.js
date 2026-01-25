export class ViewArticlePage {
    constructor (page) {
        this.page = page;
        this.commentInput = page.getByRole('textbox', { name: 'Write a comment...' });
        this.commentButton = page.getByRole('button', { name: 'Post Comment' });
        this.editArticleButton = page.getByRole('link', { name: 'Edit Article' }).nth(1);
        this.commentContent = page.locator('.card .card-block .card-text');
        this.articleContent = page.locator('.row.article-content .col-md-12 p');

    }

    async createNewComment(text) {
        await this.commentInput.click();
        await this.commentInput.fill(text);
        
        await this.commentButton.click();
    }

    async getCommentContent() {
        return this.commentContent.textContent();
    }

    async getArticleContent() {
        return this.articleContent.first().textContent(); 
    }

    async gotoEditArticle() {
        await this.editArticleButton.click();
    }
}
