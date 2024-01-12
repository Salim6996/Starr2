const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

var http = require("http");
http
  .createServer(function (req, res) {
    res.write("StarrBot 7/24 Aktif");
    res.end();
  })
  .listen(8080);

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

client.login(process.env.token);

client.once("ready", () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);
  const activities = [
    { name: "Bakımda...", type: 0 }, // Oynuyorr
  ];

  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    const newActivity = activities[randomIndex];

    client.user.setActivity(newActivity.name, { type: newActivity.type });
  }, 7000); // 7 saniyede bir değişecek
});

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "s!ping") {
    const exampleEmbed = {
      color: 0x0099ff,
      title: "PİNG",
      author: {
        name: "StarrBot - Ping",
        icon_url:
          "https://www.pngmart.com/files/16/Abstract-Gold-Star-PNG-Image.png",
        url: "https://example.com",
      },
      description: "İşte pingim!",
      image: {
        url: `https://somlicab.sirv.com/New%20Project.png?text.0.text=${client.ws.ping}ms&text.0.position.gravity=north&text.0.position.x=10%25&text.0.position.y=30%25&text.0.size=44`,
      },
    };

    message.channel.send({ embeds: [exampleEmbed] });
  }
});

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "s!yardım") {
    const exampleEmbed = {
      color: 0x0099ff,
      title: "Yardım Menüsü<a:helper:1192162120213725304>",
      description: "s!ping - **botun pingini gösterir.**",
      footer: {
        text: "Starr Bot",
      },
    };

    message.channel.send({ embeds: [exampleEmbed] });
  }
});

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "s!saat") {
    message.reply(
      `**Saat(TR)**: *${new Date().toLocaleString("tr-TR", {
        timeZone: "Europe/Istanbul",
      })}*`,
    );
  }
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("s!ban")) {
    const args = message.content.split(" ").slice(1);
    const userToBan = message.mentions.users.first();
    const reason = args.slice(1).join(" ") || "Sebep belirtilmedi";

    // Kullanıcının BanMembers yetkisini kontrol et
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply(
        "<:hata:1192466178061385728> **Kullanıcıları banlama yetkiniz yok.**",
      );
    }

    // Botun BanMembers yetkisini kontrol et
    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers,
      )
    ) {
      return message.reply(
        "**<:hata:1192466178061385728> Botun bu kullanıcıyı banlama yetkisi yok.**",
      );
    }

    // Banlanacak kullanıcıyı kontrol et
    if (!userToBan) {
      return message.reply(
        "❓ Lütfen banlamak istediğiniz kullanıcıyı etiketleyin.",
      );
    }

    // Ban işlemi
    try {
      await message.guild.members.ban(userToBan, { reason });
      const embed = new EmbedBuilder()
        .setTitle("✅ **Kullanıcı Banlandı!**")
        .setDescription(
          `**Banlanan Kullanıcı:** ${userToBan.tag}\n**ID:** ${userToBan.id}\n**Sebep:** ${reason}`,
        )
        .setColor(0xff0000)
        .setFooter({
          text: `Banlayan Yetkili: ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL(),
        });
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Ban işlemi sırasında bir hata oluştu:", error);
      await message.reply(
        "<:hata:1192466178061385728> **Ban işlemi sırasında bir hata oluştu.**",
      );
    }
  }
});
