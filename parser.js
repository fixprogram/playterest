const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

exports.imgParse = function() {
    request('https://store.steampowered.com/', (error, response, body) => {
        //если нет ошибки и сервер возвращает код 200
        if (!error && response.statusCode === 200) {

            // загружаем тело страницы в Cheerio
            const $ = cheerio.load(body);
            const srcs = [];

            // указываем класс изображений и откуда их брать
            $('.sale_capsule_image_ctn img', '.home_topsellers_ctn')
                .each((idx, pic) => {
                    const src = $(pic).attr('src');
                    srcs.push(src)
                });


            srcs.forEach((s, i) => {
                request(s).pipe(fs.createWriteStream(__dirname + `/assets/img/steam/${i}.jpg`))
            })

        }
    })

};