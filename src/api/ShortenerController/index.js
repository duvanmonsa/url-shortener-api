const shortid = require('shortid');

const { saveShortUrl, getShortUrlByHash } = require('../../db')

const parseUrls = async (req, res) => {
  const { urls } = req.body;
  if (!urls || urls.length <= 0) {
    return res.status(500).send({ status: "error", result: 'You need to provide at least one url' });
  }

  const userAgent = req.get('User-Agent');
  const language = req.get('accept-language');
  const referer = req.get('referer');

  const newShorturls = urls.map((url) => {
    return {
      hash: shortid.generate(),
      original_url: url,
      client_data: {
        ip: req.ip,
        language,
        referer,
        userAgent
      }
    }
  })
  await saveShortUrl(newShorturls);
  newShorturls.map(shortUrl => {
    shortUrl.short_url = `${process.env.API_DOMAIN}${shortUrl.hash}`
  })
  return res.json(newShorturls);
}

const redirectToUrl = async (req, res) => {
  const { hash } = req.params;
  const urlData = await getShortUrlByHash(hash);
  if (!urlData) {
    return res.status(500).send({ status: "error", result: 'The hash does not exist' });
  }

  res.redirect(urlData.original_url);
}
module.exports = {
  parseUrls,
  redirectToUrl
};
