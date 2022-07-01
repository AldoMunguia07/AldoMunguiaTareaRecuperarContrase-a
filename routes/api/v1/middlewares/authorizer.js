 const authorizer = (req, res, next) => {
    //console.log("authorizer: ", req.headers.apiKey);
    const clientApiKey = req.headers.apikey || '';
    const appApiKey = (process.env.APP_API_KEY).split('|');

    if(appApiKey.includes(clientApiKey)){
        return next();
    }


    console.error("Authorized: Invalid ApiToken")
    res.status(401).json({'error': 'Client request not authorized'});
}

module.exports.authorizer = authorizer