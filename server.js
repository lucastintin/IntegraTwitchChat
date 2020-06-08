const tmi = require('tmi.js');

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: 'illusionistar_tv',
		password: 'oauth:otbn5x68mlkbke388f01lsl817sywg'
	},
	channels: [ 'illusionistar_tv' ]
});

let isPlaying = true;
let apostas = [];
let aposta = {};

client.connect();

client.on('message', (channel, tags, message, self) => {
    if(self) return;
      
	if(message.toLowerCase() === '!hello') {
        //Consulta no Banco e diz qual é o saldo de pontos dele para apostar.
		client.say(channel, `Olá @${tags.username}, senha bem-vindo!`);
    }
    
    if(message.toLowerCase() === '!start' && tags.username === 'illusionistar_tv') {
        isPlaying = true;
        client.say(channel, `Façam suas apostas a corrida já vai começar!`);
        client.say(channel, `Digite : !bet <numero_cavalo>:<valor_aposta>`);
        client.say(channel, `Exemplo: !bet 08:100`);
    }
    
    if(message.toLowerCase() === '!stop' && tags.username === 'illusionistar_tv') {
        isPlaying = false;
		client.say(channel, `Apostas encerradas, aguarde o próximo páreo!`);
    }

    if(message.toLowerCase() === '!pay' && tags.username === 'BalbiTavern') {
		client.say(channel, `Pagando as apostas`);
    }

    
    if(message.toLowerCase().includes('!bet')) {

        aposta.isRealizada = false;
        aposta.username = tags.username;
        aposta.cavalo = 0;
        aposta.valor = 0;
        
        if (isPlaying) {

            if (message === '!bet') {
                client.say(channel, `@${tags.username}, aposta não registrada faltou informar qual cavalo e o valor que deseja apostar.`);
                return;
            }

            // tentativaAposta = message.split(' ')[1];
            aposta.cavalo = message.split(' ')[1].split(':')[0];
            aposta.valor  = message.split(' ')[1].split(':')[1];
            
            if (aposta.cavalo == ' ' && aposta.cavalo == undefined ){
                client.say(channel, `@${tags.username}, aposta não registrada faltou informar qual cavalo quer apostar.`);
                return;
            }

            //Verifica se o valor é compativel com os pontos que ele tem no banco.
            if (aposta.valor == '' && aposta.valor == undefined){
                client.say(channel, `@${tags.username}, aposta não registrada faltou informar qual valor quer apostar.`);
                return;
            }

            aposta.isRealizada = true;
            //gravar no banco
            client.say(channel, `@${tags.username}, registrada aposta de @${valor} no cavalo @${cavalo}`);
            return;

        } else {
            client.say(channel, 'Não é possível fazer apostas nesse momento. Aguarde o próximo páreo.');
            return;
        }
    }
});