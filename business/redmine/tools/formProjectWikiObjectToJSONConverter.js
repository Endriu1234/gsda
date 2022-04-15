module.exports.convertFormProjectWikiObjectToJSON = async function convertFormProjectWikiObjectToJSON(formProjectWiki) {
    const wiki = { wiki_page: {} };

    wiki.wiki_page.text = formProjectWiki.wiki;

    return JSON.stringify(wiki);
}