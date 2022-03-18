const cacheValueProvider = require('../../cache/cacheValueProvider');
const { getRedmineData, getRedmineAddress } = require('../tools/redmineConnectionTools');


class RegressionViewDataPreparer {

    constructor(softDevProjectIssues, redmineProject, displayCreated) {
        this.softDevProjectIssues = softDevProjectIssues;
        this.redmineProject = redmineProject;
        this.displayCreated = displayCreated;
    }

    async prepare() {

        let itemsPerIssue = await this.getRedmineItemsPerIssue();

        if (itemsPerIssue) {
            if (this.displayCreated === 'true') {
                for (const softDevIssue of this.softDevProjectIssues) {
                    if (itemsPerIssue[softDevIssue.ISSUE_ID] !== undefined)
                        softDevIssue.REDMINE_LINK = `${getRedmineAddress(`issues/${itemsPerIssue[softDevIssue.ISSUE_ID][0].id}`)}`;
                }
            }
            else {
                this.softDevProjectIssues = this.softDevProjectIssues.filter(softDevIssue => itemsPerIssue[softDevIssue.ISSUE_ID] === undefined);
            }
        }

        return this.softDevProjectIssues;
    }

    async getRedmineItemsPerIssue() {
        const custom_fields = await cacheValueProvider.getValue('redmine_custom_fields');
        const issueCustomField = custom_fields.find((i) => i.name === process.env.REDMINE_ISSUE_NAME);

        if (issueCustomField) {
            const projects = await cacheValueProvider.getValue('redmine_projects');
            const project = projects.find(p => p.name === this.redmineProject);

            if (project) {
                const currentProjectItems = await getRedmineData(`issues.json?project_id=${project.id}`, false);
                const itemsPerIssue = {};

                for (const item of currentProjectItems.issues) {
                    let itemIssueField = item.custom_fields.find(c => c.id === issueCustomField.id);

                    if (itemIssueField && itemIssueField.value) {
                        if (itemsPerIssue[itemIssueField.value] == undefined)
                            itemsPerIssue[itemIssueField.value] = [item];
                        else
                            itemsPerIssue[itemIssueField.value].push(item);
                    }
                }

                return itemsPerIssue;
            }
        }
    }
}

module.exports = RegressionViewDataPreparer;
