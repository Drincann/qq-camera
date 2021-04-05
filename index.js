// 引入 qq 机器人框架
const { Bot, Middleware, Message } = require('mirai-js');

const { capture } = require('./camera');
// 机器人配置
const { friendArr, qq, baseUrl, authKey } = JSON.parse(require('fs').readFileSync('./config.json'))
const bot = new Bot();

// 在异步包装中实现机器人逻辑
(async () => {
    // 创建一个机器人
    await bot.open({
        baseUrl,
        authKey,
        qq,
    });

    await bot.on('FriendMessage',
        new Middleware()
            .friendFilter(friendArr)
            .textProcessor()
            .friendLock()
            .done(async ({ text, unlock, sender: { id: friend } }) => {


                try {
                    if (/^a$/i.test(text)) {
                        bot.sendMessage({
                            friend,
                            message: new Message().addText('正在截图...')
                        });
                        const { imageId } = await bot.uploadImage({ img: await capture() });
                        bot.sendMessage({
                            friend,
                            message: new Message().addImageId(imageId)
                        });
                    }
                } catch (error) {
                    bot.sendMessage({
                        friend,
                        message: new Message().addText(error.message)
                    });
                } finally {
                    unlock();
                }
            }));
})();