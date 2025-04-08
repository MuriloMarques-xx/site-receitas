//função que executa quando o arquivo é totalmente carregado
$(document).ready(function() {

    // aqui que faz o controle do menuzinho hamburguer pra ele fechar e abrir
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x');
    });

    const sections = $('section');
    const navItems = $('.nav-item');

    $(window).on('scroll', function () {
        const header = $('header');
        const scrollPosition = $(window).scrollTop() - header.outerHeight();

        let activeSectionIndex = 0;

        if (scrollPosition <= 0) {
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1');
        } 
    });

    // aqui são as animações, vou rolando a pagina e os elementos vão aparecendo na tela
    // defino o seu id, depois daonde ele vai surgir, usei so da esquerda pra direita
    //defino a duração
    //e a distancia de onde ele ira sair
    ScrollReveal().reveal('#cta', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('.dish', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('#testimonial_chef', {
        origin: 'left',
        duration: 1000,
        distance: '20%'
    })

    ScrollReveal().reveal('.feedback', {
        origin: 'right',
        duration: 1000,
        distance: '20%'
    })
});
document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const searchTerm = this.value.toLowerCase();
        scrollToSearchTerm(searchTerm);
    }
});

function scrollToSearchTerm(term) {
    // Primeiro, remove qualquer destaque antigo aqueles span.highlight que já estavam na tela
    document.querySelectorAll('.highlight').forEach(el => {
        const parent = el.parentNode;
        // Substitui o <span class="highlight">texto</span> por só o texto puro de volta
        parent.replaceChild(document.createTextNode(el.textContent), el);
        // Junta pedaços de texto quebrados
        parent.normalize(); 
    });

    // Se o termo que busquei estiver  vazio, já para aqui
    if (!term) return;

    // Cria um "TreeWalker" que vai andar por todos os pedaços de texto da página (ignora tags, só texto mesmo)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    // Flag pra saber se encontrou ou não 
    let found = false; 

    // Vai andando de nó em nó (de pedaço de texto em pedaço de texto)
    while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.nodeValue;

        // Procura se o termo existe nesse pedaço de texto sem considerar maiúscula ou minúscula
        const index = text.toLowerCase().indexOf(term.toLowerCase());

        if (index !== -1) {
            // se achar agora vai destacar esse trecho

            //cria a tag <span class="highlight"> com o pedacinho do texto que bateu com o termo
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = text.substr(index, term.length);

            // Cria os pedaços de texto antes e depois do termo encontrado
            const before = document.createTextNode(text.substr(0, index));
            const after = document.createTextNode(text.substr(index + term.length));

            // Substitui o texto original pelo novo: antes + <span>termo</span> + depois
            const parent = node.parentNode;
            parent.replaceChild(after, node); // Joga fora o texto original
            parent.insertBefore(span, after); // Insere o destaque antes do "depois"
            parent.insertBefore(before, span); // Insere o "antes" antes do destaque

            // rola  até o trecho encontrado
            span.scrollIntoView({ behavior: 'smooth', block: 'center' });

            found = true;
             // Para no primeiro que encontrar
            break;
        }
    }

    //se não achou nada dispara a mensagem 
    if (!found) {
        alert('Nenhum resultado encontrado.');
    }
}

//aqui aonde faz a busca do CEP usando a API externa//

document.addEventListener('DOMContentLoaded', function() {
    const cepButton = document.getElementById('cep-button');
    const cepInput = document.getElementById('cep-input');
    const cepResult = document.getElementById('cep-result');

    cepButton.addEventListener('click', function() {
        const cep = cepInput.value.trim();
        if (cep) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar CEP');
                    }
                    return response.json();
                })
                .then(data => {
                    // Verifica se o CEP retornou dados válidos
                    if (data.erro) {
                        cepResult.innerHTML = 'CEP não encontrado.';
                    } else {
                        // Exibe os dados da cidade
                        cepResult.innerHTML = `
                            <p><strong>Cidade:</strong> ${data.localidade}</p>
                            <p><strong>Estado:</strong> ${data.uf}</p>
                        `;
                    }
                })
                .catch(error => {
                    cepResult.innerHTML = 'Erro ao buscar CEP: ' + error.message;
                });
        } else {
            cepResult.innerHTML = 'Por favor, insira um CEP.';
        }
    });
});
