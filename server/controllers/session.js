import axios from "axios";

const sessionController = (app) => {

    app.post('/api/session/set/', (req, res) => {
        const data = req.body.params.data
        
        for (const prop in data) {
            req.session[prop] = data[prop]
        }

        console.log(req.session)
        res.send(req.session);
    });

    app.get('/api/session/get/', async (req, res) => {

        if (req.session?.auth?.refresh_token) {
            const params = new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: req.session.auth.refresh_token,
            })

            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            await axios.post(`https://discord.com/api/oauth2/token`, params, config).catch(() => {
                req.session.auth = undefined;
            }).then((resp) => {
                req.session.auth = resp?.data
            })
        }

        res.send(req.session);
    });

    app.get('/api/session/reset', (req, res) => {
        req.session.destroy();
        res.send(200);
    });


    app.post('/api/session/auth/', async (req, res) => {
        const code = req.body.params.code

        const params = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI
        })

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        
        await axios.post(`https://discord.com/api/oauth2/token`, params, config).catch(error => {
            req.session.auth = undefined;
            console.log(error)
        }).then((resp) => {
            req.session.auth = resp?.data
            console.log(resp?.data)
        })
        res.send(req.session.auth);
    });


}
export default sessionController;