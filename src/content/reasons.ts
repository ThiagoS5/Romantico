export const reasonSlugs = [
  'sites',
  'poesia',
  'lol-e-jogos',
  'conversas',
  'encontros',
  'talentos',
] as const

export type ReasonSlug = (typeof reasonSlugs)[number]
export type MediaAspect = 'landscape' | 'portrait' | 'square'

type BaseMediaSlot = {
  id: string
  aspect: MediaAspect
  caption?: string
}

export type EmptyMediaSlot = BaseMediaSlot & {
  src?: never
  alt?: never
  prompt: string
}

export type FilledMediaSlot = BaseMediaSlot & {
  src: string
  alt: string
  prompt?: never
}

export type MediaSlot = EmptyMediaSlot | FilledMediaSlot

export type ReasonSpecialContent =
  | {
      type: 'quote'
      heading: string
      placeholder: string
    }
  | {
      type: 'list' | 'ideas' | 'chips'
      heading: string
      items: string[]
    }
  | {
      type: 'champions'
      heading: string
      groups: Array<{
        label: string
        items: string[]
      }>
    }
  | {
      type: 'projects'
      heading: string
      items: Array<{
        title: string
        description: string
      }>
    }

export type Reason = {
  slug: ReasonSlug
  bubbleLabel: string
  bubblePreview: string
  title: string
  introduction: string
  paragraphs: string[]
  closingParagraph?: string
  accentColor?: string
  mediaSlots: MediaSlot[]
  mediaPresentation?: 'gallery' | 'carousel'
  illustration?: {
    src: string
    alt: string
  }
  specialContent?: ReasonSpecialContent
  specialContentPosition?: 'after-copy' | 'after-media'
  closingQuote?: string
  externalContent?: {
    type: 'trello-poems'
    heading: string
  }
}

export const reasons = [
  {
    slug: 'sites',
    bubbleLabel: 'Sites',
    bubblePreview: 'Este lugar já é uma pequena demonstração.',
    title: 'Eu sei transformar ideias em lugares como este',
    introduction:
      'Criar sites é um dos meus maiores talentos. Eu poderia fazer milhares deles, mas este oceano foi pensado especialmente para você.',
    paragraphs: [
      'Pode parecer um detalhe simples, mas construí cada cantinho desta tela só para ver você sorrir navegando por aqui. E se um site inteiro nasceu só para isso, imagina o tanto de coisas legais que consigo criar!',
      'Para você ter uma ideia do que anda saindo da minha cabeça (e do meu teclado):',
    ],
    closingParagraph:
      'No fim das contas, para mim a tecnologia é só uma desculpa para transformar ideias em carinho — e você é a minha melhor inspiração.',
    accentColor: '#2EC4B6',
    mediaSlots: [
      {
        id: 'sites-liva',
        aspect: 'landscape',
        src: '/sites/liva.jpeg',
        alt: 'Captura vertical do projeto Liva.',
        caption: 'Projeto Liva',
      },
      {
        id: 'sites-rpg',
        aspect: 'landscape',
        src: '/sites/RPG.jpeg',
        alt: 'Captura vertical do gerador de fichas para D&D 5e.',
        caption: 'Gerador de fichas para D&D 5e',
      },
      {
        id: 'sites-to-epub',
        aspect: 'square',
        src: '/sites/ToEpub.jpeg',
        alt: 'Captura do conversor de PDF para EPUB.',
        caption: 'Conversor de PDF para EPUB',
      },
      {
        id: 'sites-red-dead',
        aspect: 'landscape',
        src: '/sites/reddead.png',
        alt: 'Tela inicial de Red Dead Online.',
        caption: 'É, realmente estou entrando para o universo...',
      },
    ],
    specialContent: {
      type: 'projects',
      heading: 'Projetos que já saíram por aqui',
      items: [
        {
          title: 'Gerador de fichas para D&D 5e',
          description: 'Para facilitar na hora de montar personagens em Dungeons & Dragons.',
        },
        {
          title: 'Conversor de PDF para EPUB',
          description: 'Feito para transformar qualquer arquivo em um e-book perfeito para ler no Kindle (sim, já pode me mandar seus PDFs para eu converter para você!).',
        },
        {
          title: 'Meu portfólio e guias de programação',
          description: 'Onde organizo meus projetos e tudo o que venho aprendendo.',
        },
        {
          title: 'Estou programando um servidor de RDR2',
          description: 'Sim, vou entrar no mundo do RP e se quiser, podemos ser um casal lá também!',
        },
      ],
    },
    specialContentPosition: 'after-copy',
  },
  {
    slug: 'poesia',
    bubbleLabel: 'Poesia',
    bubblePreview: 'Talvez o próximo poema tenha o seu nome.',
    title: 'Algumas coisas eu consigo dizer melhor escrevendo',
    introduction:
      'Eu existo entre uma poesia e outra, mas a verdade é que os versos mais bonitos nunca surgem do nada; Eles vêm quando a mente desacelera e o coração bate mais forte, ou quando alguma emoção transborda. A poesia me faz sentir nu perante a vida, sujeito às estações do ano.',
    paragraphs: [
      'Organizar a bagunça dos meus sentimentos e transformar o que eu sinto é o que me faz ser escritor.',
      'Não sei, mas meu próximo poema provavelmente vai nascer de algo que eu descobrir sobre você. Das manias bobas, do som do seu riso, de um simples olhar, uma frase solta ou de uma conversa no meio da noite.',
      'Para mim, a poesia não existe para ser perfeita, simétrica ou rimada, mas sim na coragem de ser infinito e deixar registrado. E se um simples detalhe me faz querer escrever, imagina o que podemos construir juntos...',
    ],
    accentColor: '#8ADFD7',
    mediaSlots: [],
    closingQuote: 'Um poeta não existe sem poesia, mas a poesia existe sem um poeta.',
    externalContent: {
      type: 'trello-poems',
      heading: 'Poemas guardados no Trello',
    },
  },
  {
    slug: 'lol-e-jogos',
    bubbleLabel: 'LoL & Jogos',
    bubblePreview: 'Duo, TFT e algumas calls questionáveis.',
    title: 'Também posso ser seu duo',
    introduction:
      'Entre uma partida séria e uma call cheia de risadas na madrugada, jogar junto é uma das melhores formas de descobrir o nosso ritmo. Seja para dar o nosso melhor em uma ranked ou só ficar conversando fiado enquanto o jogo rola, garanto que a diversão (e a parceria) é certa.',
    paragraphs: [
      'Não prometo que a gente nunca vai passar raiva no jogo, mas garanto que a companhia vai valer a pena (e eu juro que tento te salvar no jogo).',
    ],
    accentColor: '#68B9E3',
    mediaSlots: [
      {
        id: 'games-memories',
        aspect: 'landscape',
        src: '/jogos/jogos.jpeg',
        alt: 'Registro de um momento jogando.',
        caption: 'Para guardar uma partida',
      },
      {
        id: 'games-running',
        aspect: 'portrait',
        src: '/jogos/TodosOsJogos.jpeg',
        alt: 'Captura vertical de um jogo em andamento.',
        caption: 'Tenho mais de 200 jogos que podemos tentar explorar juntos',
      },
      {
        id: 'games-lol',
        aspect: 'portrait',
        src: '/jogos/lolzin.jpeg',
        alt: 'Captura vertical relacionada a League of Legends.',
        caption: 'Uma dose de LoL',
      },
    ],
    specialContent: {
      type: 'champions',
      heading: 'Meu pequeno mapa de jogo',
      groups: [
        {
          label: 'Campeões principais',
          items: ['Soraka (pra te manter vivo até no sufoco), Thresh (lanterninha sempre salva!), Syndra e Teemo.'],
        },
        {
          label: 'Minha rota favorita',
          items: ['Qualquer uma... contanto que seja para jogar do seu lado.'],
        },
        {
          label: 'TFT (Teamfight Tactics)',
          items: ['Posso ser sua duplinha oficial no Duplas Dinâmicas ou o "técnico" no ouvido te ajudando a montar as composições mais apelonas.'],
        },
        {
          label: 'Outros mundos para a gente explorar',
          items: ['Palworld, Diablo, Marvel Rivals, Red Dead Redemption 2, Naruto Storm, Monster Hunter, Total War: Warhammer, Path of Exile... e basicamente qualquer outro jogo se a companhia for você.'],
        },
      ],
    },
    specialContentPosition: 'after-copy',
  },
  {
    slug: 'conversas',
    bubbleLabel: 'Conversas',
    bubblePreview: 'Assuntos aleatórios também contam.',
    title: 'Eu realmente gostaria de conhecer o seu mundo',
    introduction:
      'A ideia não é falar só sobre mim, mas sim abrir espaço para te ouvir. Quero te escutar, descobrir seus maiores interesses e dar lugar até para aqueles assuntos aleatórios que surgem durante o dia ou no meio de uma conversa mais profunda.',
    paragraphs: [
      'Pra mim, conversar contigo é uma das partes mais gostosas do meu dia. Não precisa ter um assunto certo ou planejado: pode ser sobre a brisa da noite, uma playlist nova, indicações de filmes (menos "Passageiro do Mal") ou só mandar um meme durante a tarde. O tempo contigo passa mais leve.',
      'É sobre estar contigo, saber o que te faz rir, ouvir as histórias que você guarda com carinho, os perrengues do seu dia e até aquelas histórias loucas que a gente só conta para quem confia de verdade.',
    ],
    accentColor: '#49C9BD',
    mediaSlots: [],
    illustration: {
      src: '/conversas/pequenoprincipe.png',
      alt: 'Ilustração do Pequeno Príncipe sentado em um pequeno planeta com uma raposa.',
    },
    specialContent: {
      type: 'projects',
      heading: 'Assuntos que podem virar horas',
      items: [
        {
          title: 'Filmes de terror, música e artes',
          description: 'Das boas produções de cinema aos filmes de terror mais esquisitos, passando pelas nossas playlists de músicas no Spotify e desenhos feitos no improviso.',
        },
        {
          title: 'Processos criativos',
          description: 'Consigo falar por horas e horas sobre como o D&D pode ajudar a tratar ansiedade e depressão, como meus poemas e rascunhos surgem e por que uma simples flor consegue ser o objeto de adoração em um poema.',
        },
        {
          title: 'Sonhos e visões de mundo',
          description: 'Quero saber o que te traz paz de verdade, os planos que você raramente fala em voz alta, o motivo de não ser um astronauta ou passar a vida protegendo os leões-marinhos... enfim, tudo o que te faz ser quem você é!',
        },
      ],
    },
    specialContentPosition: 'after-copy',
  },
  {
    slug: 'encontros',
    bubbleLabel: 'Encontros',
    bubblePreview: 'Algumas coisas são melhores fora da tela.',
    title: 'Algumas coisas são melhores fora da tela',
    introduction:
      'Sem roteiro perfeito. A proposta é te mostrar todos os lugares e encontros que podemos ter.',
    paragraphs: [
      'Sei que ficar no computador é muito legal, mas a vida de verdade acontece lá fora. E, particularmente, eu não gosto de viver meios sentimentos ou ter uma relação morna, com meias promessas; prefiro me entregar de peito aberto.',
      'E acredito que não precisamos de nada mirabolante para ser algo inesquecível, porque a melhor parte vai ser a sua companhia. Mas, se eu puder desenhar alguns momentos que quero muito viver ao seu lado, eles seriam:',
    ],
    accentColor: '#9BDCEB',
    mediaSlots: [
      {
        id: 'dates-horse',
        aspect: 'portrait',
        src: '/encontros/cavalo.jpeg',
        alt: 'Passeio a cavalo ao ar livre.',
        caption: 'O Pai sabe cavalgar e pode te levar para dar uma volta',
      },
      {
        id: 'dates-painting',
        aspect: 'portrait',
        src: '/encontros/Dia de pintar.jpeg',
        alt: 'Momento pintando uma peça de cerâmica.',
        caption: 'Sei pintar cerâmica e posso fazer canecas para você!',
      },
      {
        id: 'dates-party',
        aspect: 'portrait',
        src: '/encontros/festa.jpeg',
        alt: 'Registro em uma festa temática.',
        caption: 'Podemos ir em festa de halloween',
      },
      {
        id: 'dates-church',
        aspect: 'portrait',
        src: '/encontros/igreja.jpeg',
        alt: 'Interior de uma igreja durante uma celebração.',
        caption: 'Apesar de não ser crente, posso ir na igreja com sua família e vou saber cantar os hinos',
      },
      {
        id: 'dates-picnic',
        aspect: 'portrait',
        src: '/encontros/piquenique.jpeg',
        alt: 'Piquenique ao ar livre.',
        caption: 'Poderia ser a gente!',
      },
      {
        id: 'dates-trip',
        aspect: 'portrait',
        src: '/encontros/Viagem.jpg',
        alt: 'Registro de uma viagem para viver momentos juntos.',
        caption: 'Podemos viver o infinito juntos!',
      },
      {
        id: 'dates-trip-landscape',
        aspect: 'landscape',
        src: '/encontros/viagem1.jpg',
        alt: 'Paisagem de viagem para explorar juntos.',
        caption: 'Podemos viver o infinito juntos!',
      },
    ],
    mediaPresentation: 'carousel',
    specialContent: {
      type: 'projects',
      heading: 'Momentos para viver ao seu lado',
      items: [
        {
          title: 'Piquenique',
          description: 'Uma toalha na grama num fim de tarde, comidas e o som do silêncio confortável entre uma risada e outra.',
        },
        {
          title: 'Arte e Música',
          description: 'Caminhar devagar pelos corredores de um museu, inventando histórias para quadros ou só trocando nossas impressões, ou até perder a nossa voz cantando junto em um show de um artista que a gente ama.',
        },
        {
          title: 'Jantar romântico',
          description: 'Uma taça de vinho, luz suave e uma boa comida...',
        },
        {
          title: 'Pé na areia',
          description: 'Fugir no fim de semana para ir à praia, sentir a brisa do mar, ouvir o som das ondas e ver a noite chegar sem ter hora para voltar.',
        },
        {
          title: 'Explorar o mundo',
          description: 'Visitar cachoeiras, trilhas, cidades grandes e pequenas, culturas diversas...',
        },
      ],
    },
    specialContentPosition: 'after-copy',
    closingQuote:
      'Como girassóis que se voltam um para o outro na escuridão para encontrar a luz, estarmos juntos fora da tela é a nossa chance de sermos o nosso próprio farol.',
  },
  {
    slug: 'talentos',
    bubbleLabel: 'Talentos',
    bubblePreview: 'Existem alguns truques além deste site.',
    title: 'Tenho alguns truques além deste site',
    introduction:
      'Nem tudo cabe em uma lista séria de habilidades. Aqui entram meus talentos do dia a dia, características práticas e pequenos fatos sobre mim que fazem muito mais sentido quando se presta um pouco de atenção.',
    paragraphs: [
      'Talvez eu não tenha tantos talentos quanto pensei, mas garanto que meu kit de habilidades pra vida real é bastante completo e surpreendente. Sou uma combinação entre a pessoa atenciosa que vai ter toda a paciência do mundo para pintar a sua unha ou sua casa, inventar vozes de personagens (incluindo a interpretação de um gato humanoide!) e fazer artes digitais, até o cara "pau pra toda obra" que resolve qualquer perrengue técnico sem drama.',
      'Basicamente, você ganha um companheiro para os momentos doces, um técnico para as emergências e um suporte completo para o cotidiano.',
    ],
    accentColor: '#57A9D4',
    mediaSlots: [
      {
        id: 'talents-bush',
        aspect: 'square',
        src: '/talento/arbusto.png',
        alt: 'Pequeno arbusto desenhado como asset de jogo.',
        caption: 'Exemplo de rabisco digital que virou asset de jogo que estava desenvolvendo!',
      },
      {
        id: 'talents-computer',
        aspect: 'landscape',
        src: '/talento/pcmontado.jpeg',
        alt: 'Computador montado e organizado sobre uma mesa.',
        caption: 'Setup montado do zero com direito a gerenciamento de cabos e sem pecinha sobrando!',
      },
      {
        id: 'talents-care',
        aspect: 'portrait',
        src: '/talento/cuidando.jpeg',
        alt: 'Momento cuidando do cachorro Luffy.',
        caption: 'Eu salvando o Luffy',
      },
      {
        id: 'talents-nails',
        aspect: 'portrait',
        src: '/talento/unha.jpeg',
        alt: 'Demonstração de uma unha sendo pintada.',
        caption: 'Eu mostrando meu talento pintando unha',
      },
      {
        id: 'talents-oracle',
        aspect: 'landscape',
        src: '/talento/oraculo.png',
        alt: 'Cartas do oráculo Angelarium dispostas para uma leitura.',
        caption: 'Angelarium é um dos oráculos mais lindos que já li',
      },
      {
        id: 'talents-tarot',
        aspect: 'portrait',
        src: '/talento/tarot.jpeg',
        alt: 'Carta de tarot escolhida durante uma leitura.',
        caption: 'Pera... vamos ser felizes?',
      },
    ],
    mediaPresentation: 'carousel',
    specialContent: {
      type: 'champions',
      heading: 'O que vem no meu pacote de habilidades',
      groups: [
        {
          label: 'Técnico & Pau pra toda obra',
          items: ['Formado em Automação Industrial, não passo aperto. O pneu do carro furou? Eu troco. O chuveiro queimou ou a fiação deu problema? Eu resolvo antes de você precisar chamar o socorro.'],
        },
        {
          label: 'Mestre do Hardware & IA',
          items: ['Seu PC queimou, tá lento ou precisa de peças novas? Eu escolho os melhores componentes de acordo com o seu bolso e monto do zero. E se uma IA não te entender... pode deixar que eu te ajudo.'],
        },
        {
          label: 'Farmacêutico de plantão',
          items: ['Não sou médico, mas trabalhei anos em farmácia. Se você ficar dodói, sei exatamente para que serve cada remédio e vou cuidar de você até ficar 100%.'],
        },
        {
          label: 'Professor de bicicleta & Cuidados',
          items: ['Se você não souber andar de bicicleta, eu te ensino com toda a calma do mundo. E sim, minhas habilidades com pincel de unha são surpreendentemente boas!'],
        },
        {
          label: 'Cozinha & Organização',
          items: ['Sei cozinhar com carinho e sou ótimo organizando o ambiente, o que deixa qualquer rotina a dois muito mais leve e gostosa.'],
        },
        {
          label: 'Crochê e pintura em cerâmica',
          items: ['Como pode ver, sei fazer até coisas que posso compartilhar com sua vovó ou usar para impressionar sua mãe.'],
        },
        {
          label: 'Sei fazer uma IV',
          items: ['Sei fazer uma IV e já salvei um cachorrinho no sítio.'],
        },
        {
          label: 'Sei jogar tarot e outros oráculos',
          items: ['Posso te ajudar a interpretar seu mapa astral ou responder perguntas! Sim... sou místico.'],
        },
      ],
    },
    specialContentPosition: 'after-media',
  },
] satisfies readonly Reason[]

export function getReasonBySlug(slug: string | undefined) {
  return reasons.find((reason) => reason.slug === slug)
}

export function isReasonSlug(slug: string | undefined): slug is ReasonSlug {
  return reasonSlugs.includes(slug as ReasonSlug)
}
