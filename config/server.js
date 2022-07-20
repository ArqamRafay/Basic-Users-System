var app,
    compression = require('compression'),
    express = require("express"),
    Raven = require("raven"),
    // Sentry = require('@sentry/node'),
    path = require("path"),
    config = require("nconf"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    logger = require("winston"),
    pg = require("pg"),
    cors = require("cors"),
    _ = require("lodash"),
    helmet = require('helmet'),
    // constants = require('crypto'),
    // https = require('https'),
    cookieParser = require('cookie-parser')

var { expressjwt: jwt } = require("express-jwt");
const _secret = require('./auth.config.js')._secret;
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocument = require('../swagger.json');

// if (process.env.NODE_ENV != "production") {
//   dotenv = require("dotenv").load();
// }
const port = process.env.PORT || 8081;

let start = function (cb) {
    app = express(); // Configure express
    app.use(helmet());

    // let express to use this
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // parse cookies
    // we need this because "cookie" is true in csrfProtection
    app.use(cookieParser());

    // app.use(xss()); // Data Sanitization against XSS
    app.use(compression()); // compress all responses
    app.use('/', express.static('assets'));
    // Sentry.init({ dsn: 'https://5029700bc15f408fbea37b5588d4ab9a@sentry.io/262418' });
    Raven.config('https://5029700bc15f408fbea37b5588d4ab9a:5a6771a90c044660913f280d52e69ecf@sentry.io/262418').install(); //configure raven-sentry       //before upload
    app.use(Raven.requestHandler());                   //before upload

    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            frameAncestors: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", 'data:']
        }
    }))
        ;
    var corsOption = {
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        // allowedHeaders: ['Authorization', 'Content-Type', 'x-auth-token', 'authorization'],
        exposedHeaders: [
            "Authorization",
            "Content-Type",
            "x-auth-token",
            "authorization",
            'Content-Security-Policy'
        ],
        credentials: true,
    };
    app.use(cors(corsOption));

    app.use(
        jwt({
            secret: _secret,
            algorithms: ["HS256"],
        }).unless({ path: ["/token/sign", "/", "/OpenApi"] })
    );

    // app.use(cors());

    //   app.use((req, res, next) => {
    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    //     return next();
    // });
    // middleware for session

    app.use(morgan("common"));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(bodyParser.json({ limit: '50mb', extended: true }));
    app.use(function (req, res, next) {
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Cache-Control", "must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        next();
    });

    logger.info("[SERVER] Initializing routes");
    //   app.use(require("../app/routes/index.route"));
    app.use(require("../routes/index.route"));

    // * * * * * *
    // | | | | | |
    // | | | | | day of week
    // | | | | month
    // | | | day of month
    // | | hour
    // | minute
    // second ( optional )


    var CronJob = require("cron").CronJob;

    new CronJob("1 * * * * *",
        async () => {
            let date_ob = new Date();
            let date = date_ob.getHours() + ':' + date_ob.getMinutes()
            console.log('CronJob Run ' + date)
        },
        null, true, 'America/Los_Angeles'
    );

    // Error handler
    app.use(Raven.errorHandler());                      //before upload
    app.use((err, req, res, next) => {
        // Sentry.captureException(err);
        Raven.captureException(err);                     //before upload
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: app.get("env") === "development" ? err : {}
        });
        next(err);
    });

    // https.createServer({
    // secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
    // pfx: fs.readFileSync(path.resolve(pathToCert))
    // }, app).listen(port);

    // app.get('/', (req, res, next) => {
    //   if (req.protocol === 'https')
    //     console.log(req.connection.getProtocol());
    //   else
    //     console.log('Not SSL');
    // });

    app.listen(port);
    logger.info(`[SERVER] Listening on port ${port}`);

    if (cb) return cb();
};

module.exports = start;
