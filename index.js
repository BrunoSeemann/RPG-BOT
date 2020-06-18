const Discord = require("discord.js"); //lib discord.js
const client = new Discord.Client();
const config = require("./config.json");

const low = require("lowdb") //lib lowdb
const FileSync = require("lowdb/adapters/FileSync")
const adapter = new FileSync('db.json')
const db = low(adapter)

//Inicialização do Bot

client.on("ready", () => {
    console.log(`RPG iniciado, com ${client.users.size} usuários em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    client.user.setGame(`RPG em ${client.guilds.size} servidores`)
});

client.on("guildCreate", guild => {
    console.log(`O RPG entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} jogadores!`);
    client.user.setActivity(`RPG em ${client.guilds.size} servidores`)
})

client.on("guildDelete", guild => {
    console.log(`O RPG foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`RPG em ${client.guilds.size} servidores`)
})

client.on("guildCreate", () => {
    db.set(guild.id, []).write()
})

//Comandos
client.on('raw', console.log)

client.on("message", async message => {

    if (message.author.bot) return
    if (message.channel.type === "dm") return
    if (!message.content.startsWith(config.prefix)) return

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const comando = args.shift().toLowerCase()

    if (comando === "rpgentrar") {
        const m = await message.channel.send("**Bem vindo à sua primeira aventura!  :map:  **")

        setTimeout(() => {
            m.edit("*Para começar vamos criar o seu Herói!*")
        }, 3000);

        setTimeout(() => {
            m.edit("*Primeiramente, escolha sua raça:*")
        }, 6000);

        setTimeout(() => {
            message.channel.send("Para ser um Humano clique em :man_in_tuxedo: \nPara ser um Elfo clique em :elf: \nPara ser uma Fada, clique em :fairy: ")
                .then(function (react) {
                    react.react("🤵")
                    react.react("🧝")
                    react.react("🧚")
                })
                .catch(function () {
                    console.log("Erro ao adicionar o emoji")
                })
            client.on('raw', async emojimsgId => {
                if (emojimsgId.t !== "MESSAGE_REACTION_ADD" && emojimsgId.t !== "MESSAGE_REACTION_REMOVE" && emojimsgId.d.user_id !== "722531198806786108") return

                let emojServId = client.guilds.get("487660044855410698")
                let PlayerId = emojServId.members.get(emojimsgId.d.user_id)

                let channelClassId = message.channel.id
                let msgClassId = emojimsgId.d.id

                let Humano = emojServId.roles.get("722538539035787339")
                let Elfo = emojServId.roles.get("722538369980301441")
                let Fada = emojServId.roles.get("722538435419701350")

                if (emojimsgId.t === "MESSAGE_REACTION_ADD" && emojimsgId.d.user_id != "722531198806786108") {
                    if (emojimsgId.d.emoji.name === "🤵" && PlayerId.roles.has("722538369980301441") != true && PlayerId.roles.has("722538435419701350") != true) {
                        if (PlayerId.roles.has(Humano)) return
                        PlayerId.addRole(Humano)
                        message.channel.send("Sua raça será: 🤵")
                        message.channel.send("Para confirmar sua escolha e prosseguir digite $classchoose")
                    } else if (emojimsgId.d.emoji.name === "🧝" && PlayerId.roles.has("722538539035787339") != true && PlayerId.roles.has("722538435419701350") != true) {
                        if (PlayerId.roles.has(Elfo)) return
                        PlayerId.addRole(Elfo)
                        message.channel.send("Sua raça será: 🧝")
                        message.channel.send("Para confirmar sua escolha e prosseguir digite $classchoose")
                    } else if (emojimsgId.d.emoji.name === "🧚" && PlayerId.roles.has("722538369980301441") != true && PlayerId.roles.has("722538539035787339") != true) {
                        if (PlayerId.roles.has(Fada)) return
                        PlayerId.addRole(Fada)
                        message.channel.send("Sua raça será: 🧚")
                        message.channel.send("Para confirmar sua escolha e prosseguir digite $classchoose")
                    }
                }
                if (emojimsgId.t === "MESSAGE_REACTION_REMOVE" && emojimsgId.d.user_id != "722531198806786108") {
                    if (emojimsgId.d.emoji.name === "🤵") {
                        if (PlayerId.roles.has(Humano)) return
                        PlayerId.removeRole(Humano)
                    } else if (emojimsgId.d.emoji.name === "🧝") {
                        if (PlayerId.roles.has(Elfo)) return
                        PlayerId.removeRole(Elfo)
                    } else if (emojimsgId.d.emoji.name === "🧚") {
                        if (PlayerId.roles.has(Fada)) return
                        PlayerId.removeRole(Fada)
                    }
                }
            })
        }, 9000);

    }

})

client.login(config.token)