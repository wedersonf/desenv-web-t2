async function handleGetRepoCommits(username, repo) {
    return fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
} 

const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const repoInput = document.getElementById('repo');

    const username = usernameInput.value;
    const repo = repoInput.value;

    usernameInput.classList.remove('ring-2')
    usernameInput.classList.remove('ring-red-500')
    repoInput.classList.remove('ring-2')
    repoInput.classList.remove('ring-red-500')

    const main = document.getElementById('repo-commits');
    const div = document.getElementById('summary');

    if (!username.trim().length && !repo.trim().length) {
        usernameInput.classList.add('ring-2')
        usernameInput.classList.add('ring-red-500')

        repoInput.classList.add('ring-2')
        repoInput.classList.add('ring-red-500')
        return alert('O campo nome do usuário ou organização e nome do repositório devem ser informados.')
    }
    
    if (!username.trim().length) {
        usernameInput.classList.add('ring-2')
        usernameInput.classList.add('ring-red-500')
        return alert('O campo nome do usuário ou organização deve ser informado.')
    }

    if (!repo.trim().length) {
        repoInput.classList.add('ring-2')
        repoInput.classList.add('ring-red-500')
        return alert('O campo nome do repositório deve ser informado.')
    }

    if (!!main.childNodes.length) {
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }
    }

    if (!!div.childNodes.length) {
        while (div.firstChild) {
            div.removeChild(div.firstChild)
        }
    }

    handleGetRepoCommits(username, repo)
        .then(response => response.json())
        .then(data => {
            const main = document.getElementById('repo-commits');
            const card = document.createElement('div');

            if (data?.message === 'Not Found') {
                card.innerHTML = (`
                    <span class="text-zinc-400">Nome de usuário e/ou repositório não foram encontrados.</span>
                `);

                main.appendChild(card);

                return
            }

            const div = document.getElementById('summary')
            const section = document.createElement('section')
            section.classList.add('flex')
            section.classList.add('flex-col')
            section.classList.add('max-w-screen-md')
            section.classList.add('w-full')
            section.classList.add('mx-auto')
            section.classList.add('mt-6')
            section.classList.add('gap-px')
            section.classList.add('p-4')
            section.classList.add('border')
            section.classList.add('border-dashed')
            section.classList.add('border-zinc-500')
            section.classList.add('rounded-md')

            section.innerHTML = (`
                <h2 class="uppercase text-zinc-300 font-medium">Repositório:</h2>

                <div class="flex items-center gap-1.5">
                    <span class="uppercase text-zinc-300 text-sm">${username}</span>
                    <span class="text-zinc-400">/</span>
                    <span class="uppercase text-zinc-300 text-sm">${repo}</span>
                </div>
            `)

            div.appendChild(section)

            for (const item in data) {
                const main = document.getElementById('repo-commits');

                const card = document.createElement('div');

                card.classList.add('flex')
                card.classList.add('h-24')
                card.classList.add('bg-zinc-700/40')
                card.classList.add('rounded-md')

                card.innerHTML = (`
                    <div class="flex flex-col items-center justify-center w-24 px-2 bg-emerald-700 rounded-l-md gap-1">
                        <span class="text-center text-sm font-medium">${data[item].sha.slice(0, 7)}</span>
                        <span class="text-center text-xs w-24 text-zinc-300">
                            ${new Intl.DateTimeFormat('pt-BR').format(new Date(data[item].commit.committer.date))}
                        </span>
                    </div>

                    <div class="flex flex-col justify-center w-full h-full px-4 py-3" gap-2>
                        <h2 class="flex-1 text-sm md:text-base text-zinc-300 w-full">${data[item].commit.message}</h2>
                        <span class="text-xs text-zinc-400 mt-auto">${data[item].commit.author.name} - ${data[item].commit.author.email}</span>
                    </div>
                `);

                main.appendChild(card);
            }

            usernameInput.value = '';
            repoInput.value = '';
        })
})

