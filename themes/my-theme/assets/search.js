import * as params from '@params';

let fuse;
let searchBox = document.getElementById('search');
let resList = document.getElementById('tableListBody');
let pagination = document.getElementById('paginationLayout');

window.onload = () => {
    fetch(params.BaseURL + 'index.json')
        .then(res => res.json())
        .then(data => {
            const options = {
                distance: 100,
                threshold: 0.0,
                ignoreLocation: true,
                keys: [
                    'title',
                    'link',
                    'vulnerabilities.title',
                    'programs.title',
                    'authors.name'
                ]
            };
            const myIndex = Fuse.createIndex(options.keys, data)
            fuse = new Fuse(data, options, myIndex);
        });
}

searchBox.addEventListener('input', () => {
    let resultSet = '';
    let results = fuse.search(searchBox.value);
    if (results.length !== 0) {
        for (let item in results) {
            let vulnerabilityList = '';
            let programList = '';
            let authorList = '';
            if (results[item].item.vulnerabilities) {
                results[item].item.vulnerabilities.forEach(vulnerability => {
                    vulnerabilityList += `<li><a href="${vulnerability.permalink}">${vulnerability.title}</a></li>`
                });
            }
            if (results[item].item.programs) {
                results[item].item.programs.forEach(program => {
                    programList += `<li><a href="${program.permalink}">${program.title}</a></li>`
                });
            }
            if (results[item].item.authors) {
                results[item].item.authors.forEach(author => {
                    authorList += `<li><a href="${author.permalink}">${author.name}</a></li>`
                });
            }
            resultSet += `<tr><td><a href="${results[item].item.permalink}">${results[item].item.title}</a></td><td><ul class="vulnerabilitiesList">${vulnerabilityList}</ul></td><td><ul class="programsList">${programList}</ul></td><td><ul class="authorsList">${authorList}</ul></td></tr>`
        }
    } else if (searchBox.value == "") {
        resultSet = `<tr><td>Type to search something...</td></tr>`
    } else {
        resultSet = `<tr><td>No results found...</td></tr>`
    }
    resList.innerHTML = resultSet;
    pagination.innerHTML = ""
})
