import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
    let stiker = false
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let autor = await conn.getName(who)
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    
    if (!/webp|image|video/g.test(mime) && !text) return m.reply(`*⚠️ RESPONDE A UNA IMAGEN O VIDEO CON ${usedPrefix + command}*`)
    if (/video/g.test(mime)) if ((q.msg || q).seconds > 10) return m.reply('*⚠️ EL VÍDEO NO PUEDE DURAR MAS DE 7 SEGUNDOS*')
    
    if (/webp|image|video/g.test(mime)) {
        let img = await q.download?.()
        console.log(img) // Verificar la imagen descargada
        
        stiker = await sticker(img, false, global.packname, global.author)
        console.log(stiker) // Verificar el sticker generado
        
        await conn.reply(m.chat, `_Calma crack estoy haciendo tu sticker 👏_\\n\\n_*Recuerda los stickersgif son de 6 segundos*_\\n\\n_*by ${wm}*_`, m, fake)
        
        if (!stiker) {
            console.log('Error al crear el sticker') // Log de error
            return m.reply('Hubo un error al crear el sticker. Por favor, intenta nuevamente.')
        }
    } else if (args[0]) {
        if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packname, global.author)
        else return m.reply('*⚠️ EL ENLACE / URL / LINK NO ES VÁLIDO*')
    }
    
    if (stiker) {
        conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    } else {
        console.log(stiker) // Log adicional
    }
}

handler.command = /^(s(tickers?)?(image|video|gif|img)?)$/i
handler.help = ['s', 'stickers']
handler.tags = ['sticker']

export default handler

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)(jpe?g|gif|png)/, 'gi'))
}

