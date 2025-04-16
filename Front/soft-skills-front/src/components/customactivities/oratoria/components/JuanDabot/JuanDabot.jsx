import juandaBot from '../../../../../resources/icons/juandabot.png';

import './JuanDabot.css';

const JuanDabot = () => {
    return (
        <a
            href="https://t.me/auto_reply_juanda_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="juan-dabot-container"
        >
            <img
                src={juandaBot}
                alt="Juanda Bot"
                className="juan-dabot-avatar"
            />
            <span className="juan-dabot-text">
                ¿Tienes dudas o quieres consejos? Chatea con JuandaBot en Telegram 💬
            </span>
        </a>
    );
};

export default JuanDabot;
