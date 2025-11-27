
document.addEventListener('DOMContentLoaded', () => {

  const nameEl = document.getElementById('name')
  const descriptionEl = document.getElementById('description')
  const homepageEl = document.getElementById('homepage')
  const author = document.getElementById('author')
  const versionsTable = document.getElementById('versions')
  const bugsEl = document.getElementById('bugs')

  window.electronAPI.getAppInfo().then(({packageJson, versions}) => {

    if(packageJson){
      nameEl.innerHTML = `${packageJson.productName ?? ''} <span>${packageJson.version ?? '0'}</span>`
      descriptionEl.textContent = packageJson.description ?? ''
      if( packageJson.homepage ) {
        homepageEl.innerHTML = `<a href='#' data-href="${packageJson.homepage}">Homepage</a>`
      }
      if( packageJson.author && (packageJson.author.name || packageJson.author.email)) {
        author.innerHTML = `${packageJson.author?.name && packageJson.author?.email ? `Author: <a href='mailto:${packageJson.author.email}'>@${packageJson.author.name}</a>` : ''}`
      }
      if(packageJson.bugs?.url) {
        bugsEl.innerHTML = `<a href='#' data-href="${packageJson.bugs.url}">Report a bug</a>`
      }
    }

    if(versions){
      for (const [name, value] of versions) {
        const tr = document.createElement('tr');
        const name_td = document.createElement('td');
        name_td.innerText = name;
        tr.appendChild(name_td);
        const version_td = document.createElement('td');
        version_td.innerText = ' : ' + value;
        tr.appendChild(version_td);
        versionsTable.appendChild(tr);
      }
    }

    document.querySelectorAll('a[data-href]').forEach((link:HTMLElement) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.electronAPI.openExternal(link.dataset.href);
      })
    })

  })
  
})

