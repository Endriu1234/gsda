const cacheValueProvider = require('../../cache/cacheValueProvider');

module.exports.convertFormProjectObjectToJSON = async function convertFormProjectObjectToJSON(formProject) {
    const redmineProject = { project: {} };

    redmineProject.project.name = formProject.name;
    redmineProject.project.identifier = formProject.identifier;
    redmineProject.project.is_public = formProject.public === 'true' ? true : false;
    redmineProject.project.inherit_members = formProject.inherit_members === 'true' ? true : false;

    if (formProject.description)
        redmineProject.project.description = formProject.description;

    if (formProject.parent_project) {
        const projects = await cacheValueProvider.getValue('redmine_projects');
        const project = projects.find(p => p.name === formProject.parent_project);
        redmineProject.project.parent_id = project.id;
    }

    return JSON.stringify(redmineProject);
}