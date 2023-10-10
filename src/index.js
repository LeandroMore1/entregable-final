import cluster from 'cluster'
import logger from './utils/logger.js'
import app from './app.js';
import { Server } from "socket.io"
import { productController } from './service/product.service.js'
import config from './env/config.js';


let port = config.PORT || 4040
let qty = config.WORKER_QTY

if (cluster.isPrimary) {
    logger.debug(`el cluster primario ${process.pid} se inicializo`);
    for (let i = 0; i < qty; i++) { 
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        logger.error(`el worker ${worker.process.pid} crasheó - ${signal || code}`);
        cluster.fork();
    });

} else {
    logger.info(`se inicializo el worker ${process.pid}`)
                const webServer = app.listen(port, () =>
                    logger.info(`Listening on PORT ${port}`)
                );
                const io = new Server(webServer)
                io.on('connection', async (socket) => {
                    logger.info('cliente conectado')
                    socket.emit('prodsList', await productController.getProducts())
                    socket.on('message', data => {
                        logger.info(data)
                    })
                
                    socket.on('message', data => {
                
                        messages.push(data)
                
                        io.emit('chatMessages', messages)
                
                    })
                })
}