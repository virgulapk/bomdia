const express = require('express');
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT); 

const Discord = require("discord.js");
const client = new Discord.Client(); 
const config = require("./config.json"); 

const db = require("quick.db");
const { stripIndents } = require("common-tags");
const { MongoClient } = require('mongodb');
const Canvas = require('canvas');
const snekfetch = require('node-superfetch');
const superagent = require("superagent");
const arraySort = require("array-sort");
const table = require("table");
const enmap = require('enmap');
var queue = new Map();
const ytdl = require('ytdl-core');
const sql = require("sqlite");
const moment = require("moment");
const fetchAll = require('discord-fetch-all')
const fs = require('fs')
const { MessageAttachment } = require('discord.js')

const mongoose = require('mongoose')
const WOKCommands = require('wokcommands')




client.on('message', message => {
	if (message.author.bot) return;
	if (message.channel.type == 'dm') return;
	if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase()))
		return;
	if (
		message.content.startsWith(`<@!${client.user.id}>`) ||
		message.content.startsWith(`<@${client.user.id}>`)
	)
		return;

	const args = message.content
		.trim()
		.slice(config.prefix.length)
		.split(/ +/g);
	const command = args.shift().toLowerCase();

	try {
		const commandFile = require(`./commands/${command}.js`);
		commandFile.run(client, message, args);
	} catch (err) {
		console.error('Erro:' + err);
	}
});

const firebase = require('firebase');
module.exports.run = client => {
	try {
		var firebaseConfig = {
			apiKey: process.env.APIKEY,
			authDomain: process.env.ADOMAIN,
			databaseURL: process.env.DBURL,
			projectId: process.env.PID,
			storageBucket: process.env.SBUCKET,
			messagingSenderId: process.env.MSGSENDER,
			appId: process.env.APPID
		};
		firebase.initializeApp(firebaseConfig);
		client.db = firebase.database();
		console.log('Conectado a database');
	} catch (err) {
		console.log('Erro ao conectar com a database');
	}
};

const { readdirSync } = require('fs');
module.exports.run = client => {
	const load = dirs => {
		const events = readdirSync(`./events/${dirs}/`).filter(d =>
			d.endsWith('.js')
		);
		for (let file of events) {
			const evt = require(`../events/${dirs}/${file}`);
			let ename = file.split('.')[0];
			client.on(ename, evt.bind(null, client));
		}
	};
	['client', 'guild'].forEach(x => load(x));
};



 /*
   ====================================================================
  */ 



 // STATUS BOT 

client.on('ready', () => {
	let activities = [
			`PK - ${config.prefix}`,
			`PK - ${client.guilds.cache.size}`,
			`PK - ${client.channels.cache.size}`,
			`PK - ${client.users.cache.size}`
		],
		i = 0;
	setInterval(
		() =>
			client.user.setActivity(`${activities[i++ % activities.length]}`, {
				type: 'WATCHING'
			}),
		1000 * 60
	);
	client.user.setStatus('dnd').catch(console.error);
		console.log('╠═══════════( Login )')
		console.log(`╠═══════════(Logado como ${client.user.tag}`);
		console.log('╠═══════════( Servers )')
		console.log(`╠═══════════(Ativo em ${client.guilds.cache.size})`)
    console.log(
		`╠═══════════( PING RECEBIDO ÁS 0:00:00 )═══════════╣`
	)
});

client.login(process.env.TOKEN);
